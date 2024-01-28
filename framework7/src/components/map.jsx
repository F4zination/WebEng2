/**
 * @fileoverview This file contains the implementation of the Map component.
 * The Map component is responsible for displaying a map and handling user interactions such as clicking on the map or searching for locations.
 * It uses the react-leaflet library to integrate with Leaflet, an open-source JavaScript library for interactive maps.
 * The Map component also makes use of other components and functions such as the Icon component from framework7-react, the getWikipediaByCity function from info_sheet.js, and the Routing component.
 * 
 * @module Map
 * @exports My_Map
 * @exports parseToAdress
 * @exports getCoordinatesFromCity
 * @exports getObjectByCoordinates
 */

import React, { useContext } from "react";
import { Icon } from "framework7-react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { f7 } from "framework7-react";
import { $ } from "dom7";
import {
    DEFAULT_LOCATION,
    FirstLocationCT,
    CurrentLocationCT,
    SecondLocationCT,
} from "../js/context";
import { getWikipediaByCity } from "./info_sheet";
import Routing, { setRoutWaypoint } from "./routing";

/**
 * Creates a Leaflet icon object for markers on the map.
 * 
 * @type {L.Icon}
 */
const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
});

/**
 * Parses the address components obtained from the reverse geocoding API response into a structured address object.
 * 
 * @param {Object} addressComponents - The address components obtained from the reverse geocoding API response.
 * @returns {Object} The parsed address object.
 */
export function parseToAdress(addressComponents) {
    const address = {};

    Object.entries(addressComponents).forEach(([key, component]) => {
        if (key.includes("number")) {
            address.streetNumber = component;
        } else if (key === "road") {
            address.street = component;
        } else if (
            key === "suburb" ||
            key === "village" ||
            key === "town" ||
            key === "city" ||
            key === "hamlet"
        ) {
            address.city = component;
        } else if (key === "country") {
            address.country = component;
        }
    });

    return address;
}

/**
 * Retrieves the coordinates (latitude and longitude) of a city using the Nominatim geocoding API.
 * 
 * @param {string} cityName - The name of the city.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the latitude and longitude of the city, or null if no coordinates are found.
 */
export async function getCoordinatesFromCity(cityName) {
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
            console.error("Could not find any coordinates for: " + cityName);
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

/**
 * Retrieves the address information (street, city, country, etc.) from the coordinates (latitude and longitude) using the Nominatim reverse geocoding API.
 * 
 * @param {number} lat - The latitude.
 * @param {number} lon - The longitude.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the parsed address information, or null if no address is found.
 */
async function getAddressFromCoordinates(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const newAddress = parseToAdress(data.address);

        return newAddress;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

/**
 * Retrieves an object containing the coordinates and address information for a given latitude and longitude.
 * If no address is found, it returns the default location.
 * 
 * @param {number} latitude - The latitude.
 * @param {number} longitude - The longitude.
 * @returns {Promise<Object>} A promise that resolves to an object containing the coordinates and address information.
 */
export async function getObjectByCoordinates(latitude, longitude) {
    let address = await getAddressFromCoordinates(latitude, longitude);
    if (!address) {
        console.error(
            "No address found for coordinates: " + latitude + " " + longitude + "\n"
        );
        return DEFAULT_LOCATION;
    }
    return {
        coordinates: {
            lat: latitude,
            lng: longitude,
        },
        address: address,
    };
}

/**
 * The Map component displays a map and handles user interactions.
 * 
 * @param {Object} props - The component props.
 * @param {React.Ref} ref - The component ref.
 * @returns {React.Element} The rendered Map component.
 */
export const My_Map = React.forwardRef((props, ref) => {
    const { setFirstLocation } = useContext(FirstLocationCT);
    const { currentLocation, setCurrentLocation } = useContext(CurrentLocationCT);
    const { setSecondLocation } = useContext(SecondLocationCT);

    const [position, setPosition] = React.useState(null);

    /**
     * Retrieves the user's current location using the Geolocation API.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object containing the user's current location.
     */
    function getUserLocation() {
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

    /**
     * Handles the location change event when the user clicks on the map.
     * 
     * @param {L.Map} map - The Leaflet map instance.
     * @param {number} lat - The latitude of the clicked location.
     * @param {number} lng - The longitude of the clicked location.
     */
    function handleLocationChangeEvent(map, lat, lng) {
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
                setCurrentLocation({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setFirstLocation({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setRoutWaypoint(location.coordinates);
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

    /**
     * Handles the search event when the user searches for a location on the map.
     * 
     * @param {L.Map} map - The Leaflet map instance.
     * @param {number} lat - The latitude of the searched location.
     * @param {number} lng - The longitude of the searched location.
     */
    function handleSearchEvent(map, lat, lng) {
        // add a marker to show where your search is
        L.marker([lat, lng], { icon }).addTo(map.target);

        // get the location name from the lat and lng
        getObjectByCoordinates(lat, lng).then((location) => {
            // get the wikipedia info for the location
            getWikipediaByCity(location.address.city).then((data) => {
                // Sets the current location, coordinates and wiki info
                setCurrentLocation({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setSecondLocation({
                    address: location.address,
                    coordinates: location.coordinates,
                    wikipedia: data,
                });
                setRoutWaypoint(location.coordinates);
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
        getUserLocation()
            .then((location) => {
                setPosition([location.coordinates.lat, location.coordinates.lng]);
                setCurrentLocation(location);
            })
            .catch((error) => {
                console.error("Error getting current location:", error);
                setPosition([
                    DEFAULT_LOCATION.coordinates.lat,
                    DEFAULT_LOCATION.coordinates.lng
                ]);
                setCurrentLocation(DEFAULT_LOCATION);
            });
    }, []);

    /**
     * Fly to the user's current location on the map.
     */
    function FlyToCurrentLocatio() {
        const map = useMap();
        map.flyTo(currentLocation.coordinates);
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
                    if (
                        e.containerPoint.x > mapWidth - 150 &&
                        e.containerPoint.y > mapHeight - 100
                    ) {
                        getUserLocation()
                            .then((location) => {
                                setPosition([
                                    location.coordinates.lat,
                                    location.coordinates.lng,
                                ]);
                                setCurrentLocation(location);

                                // clear the last marker
                                map.target.eachLayer((layer) => {
                                    if (layer instanceof L.Marker) {
                                        layer.remove();
                                    }
                                });
                                L.marker([location.coordinates.lat, location.coordinates.lng], {
                                    icon,
                                })
                                    .addTo(map.target)
                                    .bindPopup(`<h2>${location.address.city}</h2>`)
                                    .openPopup()
                                    .on("click", function () {
                                        f7.sheet.open($(".infosheet"));
                                    });
                            })
                            .catch((error) => {
                                console.error("Error getting current location:", error);
                                setPosition([
                                    DEFAULT_LOCATION.coordinates.lat,
                                    DEFAULT_LOCATION.coordinates.lng
                                ]);
                                setCurrentLocation(DEFAULT_LOCATION);
                            });
                        return;
                    }

                    const { lat, lng } = e.latlng;
                    handleLocationChangeEvent(map, lat, lng);
                });

                map.target.on("searched", function (e) {
                    console.log("Searched event received: ", e.latlng);
                    const { lat, lon } = e.latlng;
                    handleSearchEvent(map, lat, lon);
                });
                map.target.on("locationfound", function (e) {
                    console.log("Location found event received: ", e.latlng);
                    const { lat, lng } = e.latlng;
                    handleLocationChangeEvent(map, lat, lng);
                });
                map.target.locate();
            }}
            ref={ref}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToCurrentLocatio />
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
