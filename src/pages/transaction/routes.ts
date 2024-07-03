import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const routes = {
    id: 'global-transaction',
    path: 'transactions',
    children: [
        {
            id: 'income-expense',
            path: 'income-expense',
            children: [
                {
                    id: 'income-expense-list',
                    path: '',
                    Component: lazy(() => import('./income-expense'))
                },
                {
                    id: 'income-expense-list-month',
                    path: ':year/:month',
                    Component: lazy(() => import('./income-expense'))
                }
            ]
        },
        {
            id: 'transfers',
            path: 'transfers',
            children: [
                {
                    id: 'transfer-list',
                    path: '',
                    Component: lazy(() => import('./transfers'))
                },
                {
                    id: 'transfer-list-month',
                    path: ':year/:month',
                    Component: lazy(() => import('./transfers'))
                }
            ]
        }
    ]
} as RouteObject

export default routes