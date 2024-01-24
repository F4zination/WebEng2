import React, { useContext } from 'react';
import { Page, Navbar, Block, Popup } from 'framework7-react';
import {
    MapContainer,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { f7 } from 'framework7-react';
import { $ } from 'dom7';
import {
    DEFAULT_DESTINATION,
    DEFAULT_ORIGIN,
    OriginContext,
    CenterLocationContext,
    DestinationContext
  } from '../js/Context';

const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png"
});

/**
 * Parse the addressComponents of the geocoding result to an address object
 * @param addressComponents - the addressComponents of the geocoding result
 * @returns {{country: string, city: string, street: string, houseNumber: number}} - the address object
 */
export function parseAddressComponents(addressComponents) {
    const address = {};
    
    Object.entries(addressComponents).forEach(([key, component]) => {
  
        if (key.includes('number')) {
            address.streetNumber = component;
        } else if (key == 'road') {
            address.street = component;
        } else if (key == 'city' || key == 'village' || key == 'town' || key == 'hamlet' || key == 'suburb') {
            address.city = component;
        } else if (key == 'country') {
            address.country = component;
      }
    });

    return address;
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

        console.error('Error:', error);
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
      console.error('No address found for ' + latitude + ' ' + longitude + '\n');
      f7.dialog.alert(
        'No address found for lat ' +
          latitude +
          ' lng ' +
          longitude +
          '\n Using default destination instead.',
        'Error: Unable to locate'
      );
      return DEFAULT_DESTINATION;
    }
    return {
      coordinates: {
        lat: latitude,
        lng: longitude
      },
      address: address
    };
}

const My_Map = () => {
    const { origin, setOrigin } = useContext(OriginContext);
    const { centerLocation, setCenterLocation } = useContext(CenterLocationContext);
    const { destination } = useContext(DestinationContext);

    const [position, setPosition] = React.useState(null);

    async function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    //Call to wikipedia API
    async function fetchWikipediaInfo(placeName) {
        const endpoint = `https://de.wikipedia.org/w/api.php?`;
        const params = {
            action: 'query',
            prop: 'extracts|info',
            exintro: 'true',
            explaintext: 'true',
            inprop: 'url',
            titles: placeName,
            format: 'json',
            origin: '*'
        };

        const url = endpoint + new URLSearchParams(params).toString();

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const page = Object.values(data.query.pages)[0];
                return {
                    title: page.title,
                    extract: page.extract,
                    fullurl: page.fullurl
                };
            })
            .catch(error => {
                console.error('Fetching Wikipedia data failed:', error);
            });
    }

    // Leaflet Geolocation # Depricated can be removed
    async function getLocationName(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.address.village || data.address.city || data.address.town || data.address.hamlet || data.address.county || data.address.state || data.address.country;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (

        <MapContainer
            center={[position ? position[0] : 47.65931763940651, position ? position[1] : 9.453907012939455]}
            zoom={16}
            style={{ height: "93vh", width: "100%" }}
            whenReady={(map) => {
                console.log(map);
                map.target.on("click", function (e) {
                    const { lat, lng } = e.latlng;
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
                        fetchWikipediaInfo(location.address.city).then((data) => {
                            // Sets the current location, coordinates and wiki info
                            setCenterLocation({
                                address: location.address,
                                coordinates: location.coordinates,
                                wikipedia: data.extract
                            });
                            // add a popup to the marker with the wikipedia info
                            L.marker([lat, lng], { icon })
                                .addTo(map.target)
                                .bindPopup(
                                    `<h2>${data.title}</h2>
                                    <p>${data.extract}</p>
                                    <a href="${data.fullurl}" target="_blank">Wikipedia</a>`
                                )
                                .openPopup();

                        })
                    });

                    // opens the wikipedia info box
                    f7.sheet.open($('.wikibox-sheet'));
                });
            }}
        >

            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

        </MapContainer>
    );
};

export default My_Map;
