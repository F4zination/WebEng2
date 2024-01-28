
/**
 * This file defines the routes for the application.
 * Each route consists of a path and a corresponding component.
 * The routes are exported as an array of objects.
 *
 * @module routes
 */

import HomePage from '../pages/home.jsx';
import AboutPage from '../pages/about.jsx';
import NotFoundPage from '../pages/404.jsx';

/**
 * Array of route objects.
 *
 * @type {Array}
 * @property {string} path - The path of the route.
 * @property {Component} component - The component to be rendered for the route.
 */
var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
