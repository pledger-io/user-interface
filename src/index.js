import React from 'react';
import Pledger from './pledger-io';
import reportWebVitals from './reportWebVitals';
import { createRoot } from "react-dom/client";

import './index.css';
import './assets/css/Main.scss'
import './assets/css/Theme.scss'

const container = document.getElementById('root');
const root = createRoot(container);
root.render((
    <React.StrictMode>
        <Pledger />
    </React.StrictMode>
));

document.body.classList.add('dark');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
