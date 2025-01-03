import { lazy } from "react";
import { RouteObject } from "react-router";

const routes = {
    id: 'upload',
    path: 'upload',
    children: [
        {
            id: 'upload-list',
            path:'',
            Component: lazy(() => import('.'))
        },
        {
            id: 'upload-create',
            path:'create',
            Component: lazy(() => import('./upload-form'))
        },
        {
            id: 'upload-results',
            path:':slug/result',
            Component: lazy(() => import('./upload-detail'))
        },
        {
            id: 'upload-analyze',
            path:':slug/analyze',
            Component: lazy(() => import('./upload-form'))
        }
    ]
} as RouteObject

export default routes