import { User } from "oidc-client-ts";
import { lazy } from "react";
import { AuthProvider } from "react-oidc-context";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import Loading from "./components/layout/loading.component";

import account from "./pages/account/routes";
import automation from "./pages/automation/routes";
import budget from "./pages/budget/routes";
import category from "./pages/category/routes";
import contract from "./pages/contract/routes";

import LoginPage from "./pages/login";
import profile from "./pages/profile/routes";
import RegisterPage from "./pages/register";
import reports from "./pages/reports/routes";
import settings from "./pages/setting/routes";
import transactions from "./pages/transaction/routes";
import TwoFactorPage from "./pages/two-factor";
import upload from "./pages/upload/routes";

import { anonymousLoader } from "./router/anonymous.loader";
import { AuthenticatedComponent } from "./router/authenticate.wrapper";
import { authenticatedLoader } from "./router/authenticated.loader";
import { RootErrorBoundary } from "./router/error-boundary";
import { OpenIdConfig } from "./types/types";

const router = createBrowserRouter([
  {
    id: 'login',
    path: '/login',
    Component: LoginPage,
    loader: anonymousLoader
  },
  {
    id: 'register',
    path: '/register',
    Component: RegisterPage,
    loader: anonymousLoader
  },
  {
    id: 'two-factor',
    path: '/two-factor',
    Component: TwoFactorPage,
  },
  {
    id: 'authenticated',
    path: '/',
    Component: AuthenticatedComponent,
    loader: authenticatedLoader,
    errorElement: <RootErrorBoundary/>,
    hydrateFallbackElement: <Loading/>,
    children: [
      {
        id: 'dashboard',
        path: 'dashboard',
        Component: lazy(() => import('./pages/dashboard'))
      },
      account,
      automation,
      budget,
      category,
      contract,
      profile,
      reports,
      transactions,
      settings,
      upload,
      {
        id: 'catch-all',
        path: '/*',
        loader: () => redirect('/dashboard')
      }
    ]
  }
], {
  basename: '/ui'
})

function _({ openIdConfig }: {openIdConfig: OpenIdConfig}) {
  const openIdSignIn = (user: User | undefined) => {
    if (user) {
      sessionStorage.setItem('refresh-token', user.refresh_token as string);
      sessionStorage.setItem('token', user.access_token);
    }
  }

  return (
    <AuthProvider {...openIdConfig} onSigninCallback={openIdSignIn}>
      <RouterProvider router={ router }/>
    </AuthProvider>
  )
}

export default _;
