import React, { useState, useEffect } from 'react';

import {
  f7,
  f7ready,
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  List,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter
} from 'framework7-react';


import routes from '../js/routes';



const MyApp = () => {

  // Framework7 Parameters
  const f7params = {
    name: 'RevGeoCode', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: routes,
  };

  f7ready(() => {


    // Call F7 APIs here
  });

  return (
    <App {...f7params}>

      {/* Left panel with cover effect*/}
      <Panel left reveal dark>
        <View>
          <Page>
            <Navbar title="RevGeoCode" />
            <Block>
              <BlockTitle>Navigation</BlockTitle>
              <List strong inset >
                <ListItem link="/about/" title="About" />
              </List>
            </Block>
          </Page>
        </View>
      </Panel>





      {/* Your main view, should have "view-main" class */}
      <View main className="safe-areas" url="/" />

      {/* Popup */}
      <Popup id="my-popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>Popup content goes here.</p>
            </Block>
          </Page>
        </View>
      </Popup>


    </App>
  )
}
export default MyApp;