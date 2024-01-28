import React, { useState, useRef } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button
} from 'framework7-react';
import {
  SecondLocationCT,
  FirstLocationCT,
  CurrentLocationCT,
  DEFAULT_LOCATION,
} from '../js/context.js';
import {
  getCoordinatesByCityName,
  My_Map,
} from '../components/map.jsx';
import WikiBox from '../components/info_sheet.jsx';
import SearchBar from '../components/search_bar.jsx'

const HomePage = () => {
  const [destination, setDestination] = useState(DEFAULT_LOCATION);
  const [origin, setOrigin] = useState({});
  const [centerLocation, setCenterLocation] = useState(DEFAULT_LOCATION);

  const myMapRef = useRef();

  const onLocationSearched = async (query) => {
    try {
      const coordinates = await getCoordinatesByCityName(query);
      if (coordinates) {
        const { lat, lon } = coordinates;
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        if (myMapRef.current) {
          myMapRef.current.fire('searched', {
            latlng: { lat, lon }
          });
        }
      } else {
        console.warn(`No coordinates found for ${query}`);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar >
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
          <h1 className='Heading'>RevGeoCode</h1>

        </NavLeft>
        <NavRight>
          <i className="icon f7-icons">search</i>
          <SearchBar onEnterPressed={onLocationSearched} myMapRef={myMapRef} />
        </NavRight>
      </Navbar>

      {/* Page content */}
      <SecondLocationCT.Provider value={{ destination, setDestination }}>
        <CurrentLocationCT.Provider value={{ centerLocation, setCenterLocation }}>
          <FirstLocationCT.Provider value={{ origin, setOrigin }}>
            <WikiBox />
            <My_Map ref={myMapRef} />
          </FirstLocationCT.Provider>
        </CurrentLocationCT.Provider>
      </SecondLocationCT.Provider>
    </Page >
  );
};
export default HomePage;