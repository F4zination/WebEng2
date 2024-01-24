/* my-app.js */

// Import React
import React from 'react';



// Import ReactDOM
import ReactDOM from 'react-dom/client';

// Import F7 Bundle
import Framework7 from 'framework7/lite-bundle';

// Import F7-React Plugin
import Framework7React from 'framework7-react';

import 'framework7/css/bundle';

// Import Main App component
import App from './my-app.jsx';


// Init F7-React Plugin
Framework7.use(Framework7React);

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
  ReactDOM.createRoot(
    document.getElementById("app"),
  )
    .render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
});