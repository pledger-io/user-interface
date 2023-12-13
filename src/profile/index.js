import { Route } from "react-router-dom";
import React from "react";
import ProfileThemeView from "./profile-theme.view";
import ProfileCurrencyView from "./profile-currency.view";
import Profile2factorView from "./profile-2factor.view";

export const ProfileRoutes = [
    <Route key='own-account' path='/user/profile/theme' element={<ProfileThemeView />} />,
    <Route key='currency' path='/user/profile/currency' element={<ProfileCurrencyView />} />,
    <Route key='two-factor' path='/user/profile/two-factor' element={<Profile2factorView />} />,

]