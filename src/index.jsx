import React from 'react';
import Pledger from './pledger-io';
import { createRoot } from "react-dom/client";
import PrimeLocale from "./config/prime-locale";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

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
  .catch(error => {
    console.error('Failed to load localizations: ', error);
    createRoot(document.getElementById('root'))
      .render((
        <React.StrictMode>
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card
              className="w-1/2 mx-auto h-auto bg-teal-100 border-gray-200 rounded-lg"
              header={
                <div className="text-center pt-3">
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: '3em', color: '#dc3545' }}></i>
                  <h1 className="text-2xl font-extrabold">Pledger.io failed to load</h1>
                </div>
              }>
              <div className="text-center">
                <p className="mb-3">
                  Oops! An unexpected error occurred while loading the application.
                  Please try again later.
                </p>
                <Button
                  label="Reload"
                  icon="pi pi-refresh"
                  className="p-button-raised p-button-rounded"
                  onClick={() => window.location.reload()}
                />
              </div>
              <p className="text-sm text-center mt-3">
                If the problem persists, please contact support.
              </p>
            </Card>
          </div>
        </React.StrictMode>
      ));
  });
