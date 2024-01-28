import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
} from "react";
import { Page, Navbar, Block, Popup, Button, Icon } from "framework7-react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { f7 } from "framework7-react";
import { $ } from "dom7";
import {
    DEFAULT_DESTINATION,
    DEFAULT_ORIGIN,
    OriginContext,
    CenterLocationContext,
    DestinationContext,
} from "../js/Context";
import { getWikipediaByCity } from "./info_sheet";
import Routing, {
    setRoutingOriginDestination,
    setRoutingWaypoint,
} from "./Routing";

const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
});
/**
 * Parse the addressComponents of the geocoding result to an address object
 * @param addressComponents - the addressComponents of the geocoding result
 * @returns {{country: string, city: string, street: string, houseNumber: number}} - the address object
 */
export function parseAddressComponents(addressComponents) {
    const address = {};

    Object.entries(addressComponents).forEach(([key, component]) => {
        if (key.includes("number")) {
            address.streetNumber = component;
        } else if (key == "road") {
            address.street = component;
        } else if (
            key == "city" ||
            key == "village" ||
            key == "town" ||
            key == "hamlet" ||
            key == "suburb"
        ) {
            address.city = component;
        } else if (key == "country") {
            address.country = component;
        }
    });

    return address;
}

/**
 * Get coordinates from a city name
 *
 * @param cityName - name of the city
 * @returns {Promise<{lat, lon}|null>} - returns an object with latitude and longitude or null if no coordinates were found
 */
export async function getCoordinatesByCityName(cityName) {
    const formattedCityName = encodeURIComponent(cityName);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${formattedCityName}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };
        } else {
            console.error("No coordinates found for city: " + cityName);
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

/**
 * Get the address from the latlng
 *
 * @param latitude - latitude of the address
 * @param longitude - longitude of the address
 * @returns {Promise<{}|null>} - returns an object with the address or null if no address was found
 */
async function getAddressByCoordinates(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const newAddress = parseAddressComponents(data.address);

        return newAddress;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

/**
 * Get the location object from the address
 * @param latitude - latitude of the address
 * @param longitude - longitude of the address
 * @returns {Promise<{address: {}, coordinates: {lng, lat}}|{address: {country: string, city: string, streetNumber: string, street: string}, coordinates: {lng: number, lat: number}}>} - returns an object with the address and coordinates or a default address if no address was found
 */
export async function getObjectByCoordinates(latitude, longitude) {
    let address = await getAddressByCoordinates(latitude, longitude);
    if (!address) {
        console.error("No address found for " + latitude + " " + longitude + "\n");
        f7.dialog.alert(
            "No address found for lat " +
            latitude +
            " lng " +
            longitude +
            "\n Using default destination instead.",
            "Error: Unable to locate"
        );
        return DEFAULT_DESTINATION;
    }
    return {
        coordinates: {
            lat: latitude,
            lng: longitude,
        },
        address: address,
    };
}

export const My_Map = React.forwardRef((props, ref) => {
    const { origin, setOrigin } = useContext(OriginContext);
    const { centerLocation, setCenterLocation } = useContext(
        CenterLocationContext
    );
    const { setDestination } = useContext(DestinationContext);
    const { destination } = useContext(DestinationContext);

    const [position, setPosition] = React.useState(null);

    /**
     * Get current location of user
     * @returns {Promise<unknown>} - Promise containing user location object
     */
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    resolve(
                        await getObjectByCoordinates(
                            position.coords.latitude,
                            position.coords.longitude
                        )
                    );
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    //Call to wikipedia API
    async function fetchWikipediaInfo(placeName) {
        const formattedPlaceName = encodeURIComponent(placeName);
        const endpoint = `https://de.wikipedia.org/w/api.php?`;
        const params = {
            action: "query",
            prop: "extracts|info",
            exintro: "true",
            explaintext: "true",
            inprop: "url",
            titles: formattedPlaceName,
            format: "json",
            origin: "*",
        };

        const url = endpoint + new URLSearchParams(params).toString();

        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const page = Object.values(data.query.pages)[0];
                return {
                    title: page.title,
                    extract: page.extract,
                    fullurl: page.fullurl,
                };
            })
            .catch((error) => {
                console.error("Fetching Wikipedia data failed:", error);
            });
    }

    function handleClickEvent(map, lat, lng) {
        console.log("You clicked the map at LAT: " + lat + " and LONG: " + lng);

        // clear the last marker
        map.target.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                layer.remove();
            }
        });




        // add a marker to show where you clicked
        L.marker([lat, lng], { icon }).addTo(map.target);

        // get the location name from the lat and lng
        getObjectByCoordinates(lat, lng).then((location) => {
            // get the wikipedia info for the location
            getWikipediaByCity(location.address.city).then((data) => {
                // Sets the current location, coordinates and wiki info
                setCenterLocation({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setOrigin({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setRoutingWaypoint(location.coordinates);
                // add a popup to the marker with the wikipedia info
                L.marker([lat, lng], { icon })
                    .addTo(map.target)
                    .bindPopup(`<h2>${location.address.city}</h2>`)
                    .openPopup()
                    .on("click", function () {
                        f7.sheet.open($(".infosheet"));
                    });
            });
        });
    }

    function handleSearchEvent(map, lat, lng) {
        console.log(
            "You searched location is at LAT: " + lat + " and LONG: " + lng
        );
        // clear the last search marker TODO:

        // add a marker to show where your search is
        L.marker([lat, lng], { icon }).addTo(map.target);

        // get the location name from the lat and lng
        getObjectByCoordinates(lat, lng).then((location) => {
            // get the wikipedia info for the location
            getWikipediaByCity(location.address.city).then((data) => {
                // Sets the current location, coordinates and wiki info
                setCenterLocation({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setDestination({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setRoutingWaypoint(location.coordinates);
                // add a popup to the marker with the wikipedia info
                L.marker([lat, lng], { icon })
                    .addTo(map.target)
                    .bindPopup(`<h2>${location.address.city}</h2>`)
                    .openPopup()
                    .on("click", function () {
                        f7.sheet.open($(".infosheet"));
                    });
            });
        });
    }

    // get the current location and set the position
    React.useEffect(() => {
        getCurrentLocation()
            .then((location) => {
                setPosition([location.coordinates.lat, location.coordinates.lng]);
                setCenterLocation(location);
            })
            .catch((error) => {
                console.error("Error getting current location:", error);
                setPosition(
                    DEFAULT_ORIGIN.coordinates.lat,
                    DEFAULT_ORIGIN.coordinates.lng
                );
                setCenterLocation(DEFAULT_ORIGIN);
            });
    }, []);

    /**
     * Flies to the centerLocation whenever it changes
     */
    function FlyToAddress() {
        const map = useMap();
        map.flyTo(centerLocation.coordinates);
    }

    return (
        <MapContainer
            center={[
                position ? position[0] : 47.65931763940651,
                position ? position[1] : 9.453907012939455,
            ]}
            zoom={16}
            style={{ height: "93vh", width: "100%" }}
            whenReady={(map) => {
                map.target.on("click", function (e) {
                    // get height and width of the map
                    const mapHeight = map.target.getSize().y;
                    const mapWidth = map.target.getSize().x;
                    // check if the click was on the home button
                    console.log(e)
                    console.log(mapWidth, mapHeight)
                    if (e.containerPoint.x > mapWidth - 150 && e.containerPoint.y > mapHeight - 100) {
                        getCurrentLocation()
                            .then((location) => {
                                setPosition([location.coordinates.lat, location.coordinates.lng]);
                                setCenterLocation(location);

                                // clear the last marker
                                map.target.eachLayer((layer) => {
                                    if (layer instanceof L.Marker) {
                                        layer.remove();
                                    }
                                });
                                L.marker([location.coordinates.lat, location.coordinates.lng], { icon })
                                    .addTo(map.target)
                                    .bindPopup(`<h2>${location.address.city}</h2>`)
                                    .openPopup()
                                    .on("click", function () {
                                        f7.sheet.open($(".infosheet"));
                                    });

                            })
                            .catch((error) => {
                                console.error("Error getting current location:", error);
                                setPosition(
                                    DEFAULT_ORIGIN.coordinates.lat,
                                    DEFAULT_ORIGIN.coordinates.lng
                                );
                                setCenterLocation(DEFAULT_ORIGIN);
                            });
                        return;

                    }

                    const { lat, lng } = e.latlng;
                    handleClickEvent(map, lat, lng);
                });

                map.target.on("searched", function (e) {
                    console.log("Searched event received: ", e.latlng);
                    const { lat, lon } = e.latlng;
                    handleSearchEvent(map, lat, lon);
                });
                map.target.on("locationfound", function (e) {
                    console.log("Location found event received: ", e.latlng);
                    const { lat, lng } = e.latlng;
                    console.log(lat, lng);
                    handleClickEvent(map, lat, lng);
                });
                map.target.locate();
            }}
            ref={ref}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToAddress />
            <Routing />

            <button id="BacktoHome">
                <Icon>
                    <i className="f7-icons">house</i>
                </Icon>
            </button>



        </MapContainer>

    );
});

export default My_Map;
