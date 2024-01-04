import { Route } from "react-router-dom";
import React from "react";
import ProfileThemeView from "./profile-theme.view";
import ProfileCurrencyView from "./profile-currency.view";
import Profile2factorView from "./profile-2factor.view";
import ProfileSessionsView from "./profile-sessions.view";
import ProfilePasswordView from "./profile-password.view";
import ProfileConfigImportView from "./profile-config-import.view";
import ProfileExportView from "./profile-export.view";
import ProfileExportTransactionsView from "./profile-export-transactions.view";

export const ProfileRoutes = [
    <Route key='own-account' path='/user/profile/theme' element={<ProfileThemeView />} />,
    <Route key='currency' path='/user/profile/currency' element={<ProfileCurrencyView />} />,
    <Route key='two-factor' path='/user/profile/two-factor' element={<Profile2factorView />} />,
    <Route key='sessions' path='/user/profile/sessions' element={<ProfileSessionsView />} />,
    <Route key='password' path='/user/profile/password' element={<ProfilePasswordView />} />,
    <Route key='profile' path='/user/profile/import' element={<ProfileConfigImportView />} />,
    <Route key='export' path='/user/profile/export' element={<ProfileExportView />} />,
    <Route key='transactions' path='/user/profile/transactions' element={<ProfileExportTransactionsView />} />,

]