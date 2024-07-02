import { lazy } from "react";

const routes = {
    id: 'contracts',
    path: 'contracts',
    children: [
        {
            id: 'contract-list',
            path: '',
            Component: lazy(() => import('./')),
        },
        {
            id: 'contract-add',
            path: 'create',
            Component: lazy(() => import('./contract-form'))
        },
        {
            id: 'contract-edit',
            path: ':id/edit',
            Component: lazy(() => import('./contract-form'))
        },
        {
            id: 'contract-view',
            path: ':id',
            Component: lazy(() => import('./contract-details'))
        }
    ]
}

export default routes;