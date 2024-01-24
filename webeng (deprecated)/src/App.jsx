// App.jsx

import { App, } from 'framework7-react';
import routes from './routes.js';

const f7params = {
    // Array with app routes
    routes,
    // App Name
    name: 'My App',
    // ...
};

export default () => (
    {/* Main Framework7 App component where we pass Framework7 params */ }
    < App, f7params >
    {/* Status bar overlay for fullscreen mode*/ });


