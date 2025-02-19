import React from 'react';
import Pledger from './pledger-io';
import { createRoot } from "react-dom/client";

import './index.css';
import './assets/css/Main.scss'
import './assets/css/Theme.scss'

createRoot(document.getElementById('root'))
    .render((
    <React.StrictMode>
        <Pledger />
    </React.StrictMode>
));
