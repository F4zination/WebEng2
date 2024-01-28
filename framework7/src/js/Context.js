
/**
 * @fileoverview This file contains the definition of React contexts and default values used in the application.
 * @module Context
 */

import { createContext } from 'react';

/**
 * A context that provides the current location information.
 * @type {React.Context}
 */
export const CurrentLocationCT = createContext({});

/**
 * A context that provides the first location information.
 * @type {React.Context}
 */
export const FirstLocationCT = createContext({});

/**
 * A context that provides the second location information.
 * @type {React.Context}
 */
export const SecondLocationCT = createContext({});

/**
 * The default origin location.
 * @type {Object}
 * @property {Object} coordinates - The coordinates of the location.
 * @property {number} coordinates.lat - The latitude of the location.
 * @property {number} coordinates.lng - The longitude of the location.
 * @property {Object} address - The address of the location.
 * @property {string} address.country - The country of the location.
 * @property {string} address.city - The city of the location.
 * @property {string} address.street - The street of the location.
 * @property {string} address.streetNumber - The street number of the location.
 */
export const DEFAULT_LOCATION = {
  coordinates: {
    lat: 1.2756005,
    lng: 103.8619528
  },
  address: {
    country: 'Singapore',
    city: 'Singapore',
    street: 'Marina Gardens Drive',
    streetNumber: '1'
  }
};

/**
 * The default Wikipedia article for a city.
 * @type {string}
 */
export const DEFAULT_WIKI = 'No Wikipedia article found for this city.';
