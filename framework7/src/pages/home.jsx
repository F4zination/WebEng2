/**
 * @file This file contains the implementation of the HomePage component.
 * It is responsible for rendering the home page of the application.
 * The home page consists of a top navbar, search bar, info sheet, and a map.
 * The user can search for a location using the search bar, and the map will display the location.
 * The component uses context providers to manage the state of the destination, origin, and center location.
 * @module HomePage
 */

import React, { useState, useRef } from "react";
import { Page, Navbar, NavLeft, NavRight, Link } from "framework7-react";
import {
  SecondLocationCT,
  FirstLocationCT,
  CurrentLocationCT,
  DEFAULT_LOCATION,
} from "../js/context.js";
import { getCoordinatesFromCity, My_Map } from "../components/map.jsx";
import InfoSheet from "../components/info_sheet.jsx";
import SearchBar from "../components/search_bar.jsx";

/**
 * The HomePage component renders the home page of the application.
 * It includes a top navbar, search bar, info sheet, and a map.
 * @returns {JSX.Element} The rendered home page.
 */
const HomePage = () => {
  const [destination, setSecondLocation] = useState(DEFAULT_LOCATION);
  const [origin, setFirstLocation] = useState({});
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  const myMapRef = useRef();

  /**
   * Handles the location search event.
   * Retrieves the coordinates of the searched location and updates the map accordingly.
   * @param {string} query - The location query entered by the user.
   * @returns {Promise<void>} A promise that resolves when the location search is complete.
   */
  const onLocationSearched = async (query) => {
    try {
      const coordinates = await getCoordinatesFromCity(query);
      if (coordinates) {
        const { lat, lon } = coordinates;
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        if (myMapRef.current) {
          myMapRef.current.fire("searched", {
            latlng: { lat, lon },
          });
        }
      } else {
        console.warn(`No coordinates found for ${query}`);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
          <h1 className="Heading">RevGeoCode</h1>
        </NavLeft>
        <NavRight>
          <i className="icon f7-icons">search</i>
          <SearchBar onEnterPressed={onLocationSearched} myMapRef={myMapRef} />
        </NavRight>
      </Navbar>
      {/* Page content */}
      <SecondLocationCT.Provider value={{ destination, setSecondLocation }}>
        <CurrentLocationCT.Provider
          value={{ currentLocation, setCurrentLocation }}
        >
          <FirstLocationCT.Provider value={{ origin, setFirstLocation }}>
            <InfoSheet />
            <My_Map ref={myMapRef} />
          </FirstLocationCT.Provider>
        </CurrentLocationCT.Provider>
      </SecondLocationCT.Provider>
    </Page>
  );
};

export default HomePage;
