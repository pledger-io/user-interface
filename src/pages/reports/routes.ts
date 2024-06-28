import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const routes = {
    id: 'reports',
    path: 'reports',
    children: [
        {
            id: 'budget-balance',
            path: 'monthly-budget',
            Component: lazy(() => import('./budget-monthly'))
        },
        {
            id: 'budget-balance-monthly',
            path: 'monthly-budget/:year/:currency',
            Component: lazy(() => import('./budget-monthly'))
        },
        {
            id: 'income-expense',
            path: 'income-expense',
            Component: lazy(() => import('./income-expense'))
        },
        {
            id: 'income-expense-monthly',
            path: 'income-expense/:year/:currency',
            Component: lazy(() => import('./income-expense'))
        },
        {
            id: 'category-balance',
            path: 'monthly-category',
            Component: lazy(() => import('./category-monthly'))
        },
        {
            id: 'category-balance-monthly',
            path: 'monthly-category/:year/:currency',
            Component: lazy(() => import('./category-monthly'))
        },
    ]
} as RouteObject

export default routes;