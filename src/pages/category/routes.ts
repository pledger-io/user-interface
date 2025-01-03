import { lazy } from "react";
import { RouteObject } from "react-router";

const routes = {
    id: 'categories',
    path: 'categories',
    children: [
        {
            id: 'category-list',
            path: '',
            Component: lazy(() => import('./index')),
        },
        {
            id: 'category-add',
            path: 'add',
            Component: lazy(() => import('./category-form'))
        },
        {
            id: 'category-edit',
            path: ':id/edit',
            Component: lazy(() => import('./category-form'))
        }
    ]
} as RouteObject

export default routes