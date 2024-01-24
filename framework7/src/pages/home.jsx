import React from 'react';
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
import My_Map from '../components/map.jsx';

const HomePage = () => (
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

    <My_Map />





  </Page >
);
export default HomePage;