import { lazy } from "react";
import { RouteObject } from "react-router";

const routes = {
    id: 'setting',
    path: 'settings',
    children: [
        {
            id: 'currency-overview',
            path: 'currencies',
            Component: lazy(() => import('./currency'))
        },
        {
            id: 'currency-add',
            path: 'currencies/add',
            Component: lazy(() => import('./currency/currency-form'))
        },
        {
            id: 'currency-edit',
            path: 'currencies/:code/edit',
            Component: lazy(() => import('./currency/currency-form'))
        },
        {
            id: 'setting-overview',
            path: 'configure',
            Component: lazy(() => import('./overview'))
        },
    ]
} as RouteObject

export default routes