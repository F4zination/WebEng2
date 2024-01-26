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
  DestinationContext,
  OriginContext,
  CenterLocationContext,
  DEFAULT_DESTINATION,
} from '../js/Context';
import {
  getCoordinatesByCityName,
  My_Map,
} from '../components/map.jsx';
import WikiBox from '../components/wiki_box.jsx';
import SearchBar from '../components/search_bar.jsx'

const HomePage = () => {
  const [destination, setDestination] = useState(DEFAULT_DESTINATION);
  const [origin, setOrigin] = useState({});
  const [centerLocation, setCenterLocation] = useState(DEFAULT_DESTINATION);

  const myMapRef = useRef();

  const onLocationSearched = async (query) => {
    try{
      const coordinates = await getCoordinatesByCityName(query);
      if(coordinates) {
        const {lat, lon} = coordinates;
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        if (myMapRef.current) {
          myMapRef.current.fire('searched', {
            latlng: {lat, lon}
          });
        }
      }else {
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
          <SearchBar onEnterPressed={onLocationSearched} myMapRef={myMapRef}/>
        </NavRight>
      </Navbar>
      
      {/* Page content */}
      <DestinationContext.Provider value={{ destination, setDestination }}>
            <CenterLocationContext.Provider value={{ centerLocation, setCenterLocation }}>
              <OriginContext.Provider value={{ origin, setOrigin }}>
                <WikiBox />
                <My_Map ref={myMapRef} />
              </OriginContext.Provider>
            </CenterLocationContext.Provider>
          </DestinationContext.Provider>
    </Page >
  );
};
export default HomePage;