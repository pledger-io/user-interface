import React from 'react';
import Pledger from './pledger-io';
import { createRoot } from "react-dom/client";
import PrimeLocale from "./config/prime-locale";

import './index.css';
import './assets/css/Theme.scss'

PrimeLocale()
  .then(() => {
    console.log('All localizations loaded, starting application.')
    createRoot(document.getElementById('root'))
      .render((
        <React.StrictMode>
          <Pledger/>
        </React.StrictMode>
      ));
  })
