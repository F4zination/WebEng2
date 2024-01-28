import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

/**
 * Renders the NotFoundPage component.
 * This component displays a "Not found" page with a title, a back link, and a message indicating that the requested content was not found.
 */
const NotFoundPage = () => (
  <Page>
    <Navbar title="Not found" backLink="Back" />
    <Block strong inset>
      <p>Sorry</p>
      <p>Requested content not found.</p>
    </Block>
  </Page>
);

export default NotFoundPage;
