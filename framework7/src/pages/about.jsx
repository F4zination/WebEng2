import React from 'react';
import { Page, Navbar, Block, BlockTitle, CardContent } from 'framework7-react';

const AboutPage = () => (
  <Page>
    <Navbar title="About" backLink="Back" />
    <BlockTitle>Heroic Programmer Single-Handedly Rescues Group Project from the Brink of Disaster!</BlockTitle>
    <Block strong id="pain">
      <p>
      RevGeoCode is a cutting-edge online mapping platform that redefines the way you navigate the world. Much like Google Maps, our service is designed to provide reliable, 
      real-time location data. However, where we stand apart is our advanced Reverse Geocoding technology.</p>
      <p>
      Reverse Geocoding is the process of converting geographic coordinates into a human-readable address. 
      Our platform integrates this technology, transforming the way you understand and interact with location data. 
      Whether you are a business owner wanting to analyze customer locations, a developer seeking to enhance your application with location-specific features, 
      or an adventurer planning your next journey, RevGeoCode is the tool for you.
      </p>
      <p >
      At RevGeoCode, we are dedicated to providing a quality service that meets the needs of all our users. 
      We continually update and optimize our platform to ensure you have the most accurate and up-to-date location data at your fingertips. 
      Whether you're using RevGeoCode for personal or professional purposes, our mission is to make your location tracking and navigation experience seamless and efficient.
      </p>
      <p>
      Experience the difference with RevGeoCode – your ultimate tool for advanced mapping and location analysis.
      </p>
    </Block>
  </Page>
);

export default AboutPage;
