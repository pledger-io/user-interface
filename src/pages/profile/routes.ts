import { lazy } from "react";
import { RouteObject } from "react-router";

const routes = {
    id: 'profile',
    path: 'user/profile',
    children: [
        {
            id: 'theme',
            path: 'theme',
            Component: lazy(() => import('./profile-theme.view')),
        },
        {
            id: 'currency',
            path: 'currency',
            Component: lazy(() => import('./profile-currency.view')),
        },
        {
            id: 'profile-two-factor',
            path: 'two-factor',
            Component: lazy(() => import('./profile-2factor.view'))
        },
        {
            id: 'sessions',
            path: 'sessions',
            Component: lazy(() => import('./profile-sessions.view')),
        },
        {
            id: 'password',
            path: 'password',
            Component: lazy(() => import('./profile-password.view')),
        },
        {
            id: 'import',
            path: 'import',
            Component: lazy(() => import('./profile-config-import.view')),
        },
        {
            id: 'export',
            path: 'export',
            Component: lazy(() => import('./profile-export.view')),
        },
        {
            id: 'export-transactions',
            path: 'transactions',
            Component: lazy(() => import('./profile-export-transactions.view')),
        }
    ]
} as RouteObject

export default routes