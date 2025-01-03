import { lazy } from "react";
import { RouteObject } from "react-router";

const routes = {
    id: 'reports',
    path: 'reports',
    children: [
        {
            id: 'report-budget-balance',
            path: 'monthly-budget',
            Component: lazy(() => import('./budget-monthly'))
        },
        {
            id: 'report-budget-balance-monthly',
            path: 'monthly-budget/:year/:currency',
            Component: lazy(() => import('./budget-monthly'))
        },
        {
            id: 'report-income-expense',
            path: 'income-expense',
            Component: lazy(() => import('./income-expense'))
        },
        {
            id: 'report-income-expense-monthly',
            path: 'income-expense/:year/:currency',
            Component: lazy(() => import('./income-expense'))
        },
        {
            id: 'report-category-balance',
            path: 'monthly-category',
            Component: lazy(() => import('./category-monthly'))
        },
        {
            id: 'report-category-balance-monthly',
            path: 'monthly-category/:year/:currency',
            Component: lazy(() => import('./category-monthly'))
        },
    ]
} as RouteObject

export default routes;