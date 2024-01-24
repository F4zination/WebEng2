import React, { useState } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Searchbar,
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
import My_Map from '../components/map.jsx';
import WikiBox from '../components/WikiBox.jsx';

const HomePage = () => {
  const [destination, setDestination] = useState(DEFAULT_DESTINATION);
  const [origin, setOrigin] = useState({});
  const [centerLocation, setCenterLocation] = useState(DEFAULT_DESTINATION);

  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar >
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
          <h1 className='Heading'>RevGeoCode</h1>
        </NavLeft>
        <NavRight>
          <Searchbar placeholder='Search' />
        </NavRight>
      </Navbar>
      {/* Page content */}
      <DestinationContext.Provider value={{ destination, setDestination }}>
            <CenterLocationContext.Provider value={{ centerLocation, setCenterLocation }}>
              <OriginContext.Provider value={{ origin, setOrigin }}>
                <WikiBox />
                <My_Map />
              </OriginContext.Provider>
            </CenterLocationContext.Provider>
          </DestinationContext.Provider>
    </Page >
  );
};
export default HomePage;