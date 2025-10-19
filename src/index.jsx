import React, {useContext, useEffect} from 'react';
import Pledger from './pledger-io';
import { createRoot } from "react-dom/client";
import PrimeLocale from "./config/prime-locale";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import {Themes} from "./context/theme-context.js";
import {PrimeReactContext, PrimeReactProvider} from "primereact/api";
import {SettingRepository} from "./core/RestAPI.js";

const themeLink = document.getElementById('theme-link')
document.head.removeChild(themeLink);
document.head.appendChild(themeLink);

function constructRedirectUri() {
  const hasParams = document.location.search.includes('?');
  if (!hasParams) {
    return document.location.href;
  }

  const params = new URLSearchParams(window.location.search);
  let redirectUrl = document.location.href.substring(0, document.location.href.indexOf('?'))
  if (params.has('from')) {
    redirectUrl += '?from=' + params.has('from');
  }
  return redirectUrl;
}

const openIdConfigResponse = await fetch('/.well-known/openid-connect');
if (openIdConfigResponse.ok) {
  const openIdConfig = await openIdConfigResponse.json()
  document.openIdConfig = {
    authority: openIdConfig.authority,
    client_id: openIdConfig.clientId,
    client_secret: openIdConfig.clientSecret,
    redirect_uri:  constructRedirectUri()
  };
}

PrimeLocale()
  .then(() => {
    console.log('All localizations loaded, starting application.')
    SettingRepository.list()
      .then(data => {
        console.debug('Fetched all application settings from the backend.')
        data.forEach(({name, value}) => {sessionStorage.setItem(name, value)})
      })
    createRoot(document.getElementById('root'))
      .render((
        <React.StrictMode>
          <Pledger openIdConfig={document.openIdConfig}/>
        </React.StrictMode>
      ));
  })
  .catch(error => {
    console.error('Failed to load localizations: ', error);
    createRoot(document.getElementById('root'))
      .render((
        <React.StrictMode>
          <PrimeReactProvider>
              <LoadingFailed />
          </PrimeReactProvider>
        </React.StrictMode>
      ));
  });

const LoadingFailed = ({}) => {
  const { changeTheme } = useContext(PrimeReactContext);

  useEffect(() => {
    changeTheme(Themes.light.stylesheet, Themes.light.stylesheet, 'theme-link')
  }, []);

  return <div className="flex items-center justify-center h-screen bg-gray-100">
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
}
