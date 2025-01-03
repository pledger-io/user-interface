import { lazy } from "react";
import { RouteObject } from "react-router";

const routes = {
    id: 'budget',
    path: 'budgets',
    children: [
        {
            id: 'budget-overview',
            path: '',
            Component: lazy(() => import('./index')),
        },
        {
            id: 'budget-overview-monthly',
            path: ':year/:month',
            Component: lazy(() => import('./index')),
        },
        {
            id: 'budget-initial',
            path: 'first-setup',
            Component: lazy(() => import('./initial-budget')),
        }
    ]
} as RouteObject

export default routes