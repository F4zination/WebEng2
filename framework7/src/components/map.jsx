import React from 'react';
import { Page, Navbar, Block, Popup } from 'framework7-react';
import {
    MapContainer,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png"
});



const My_Map = () => {

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

    // Leaflet Geolocation
    async function getLocationName(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('data', data)
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
                    getLocationName(lat, lng).then((name) => {
                        // get the wikipedia info for the location
                        fetchWikipediaInfo(name).then((data) => {
                            // add a popup to the marker with the wikipedia info
                            console.log(data);
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
