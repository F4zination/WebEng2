import {
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./index.css";
import icon from "./constants";
import React, { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    initPosition();
  }, []);

  async function initPosition() {
    try {
      const position = await getCurrentLocation();
      console.log('position', position.coords.latitude, position.coords.longitude);
      setPosition([position.coords.latitude, position.coords.longitude]);
    } catch (error) {
      console.error('Error:', error);
    }
  }

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
      style={{ height: "100vh" }}
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
                  `<b>${data.title}</b><br>${data.extract}<br><a href="${data.fullurl}">Wikipedia</a>`
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
}
