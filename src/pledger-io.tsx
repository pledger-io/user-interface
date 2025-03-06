import {createBrowserRouter, redirect, RouterProvider} from "react-router";
import {lazy} from "react";
import Loading from "./components/layout/loading.component";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import TwoFactorPage from "./pages/two-factor";

import account from "./pages/account/routes";
import automation from "./pages/automation/routes";
import budget from "./pages/budget/routes";
import category from "./pages/category/routes";
import contract from "./pages/contract/routes";
import profile from "./pages/profile/routes";
import reports from "./pages/reports/routes";
import transactions from "./pages/transaction/routes";
import settings from "./pages/setting/routes";
import upload from "./pages/upload/routes";

import {anonymousLoader} from "./router/anonymous.loader";
import {authenticatedLoader} from "./router/authenticated.loader";
import {RootErrorBoundary} from "./router/error-boundary";
import {AuthenticatedComponent} from "./router/authenticate.wrapper";

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
        id: 'pledger',
        path: '/',
        Component: AuthenticatedComponent,
        loader: authenticatedLoader,
        errorElement: <RootErrorBoundary />,
        hydrateFallbackElement: <Loading />,
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

function _() {
    return (
        <RouterProvider router={ router } />
    )
}

export default _;