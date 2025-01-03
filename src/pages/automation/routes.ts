import { lazy } from "react";
import { RouteObject } from "react-router";

import scheduled from "./schedule/routes";

const routes = {
    id: 'automation',
    path: 'automation/schedule',
    children: [
        scheduled,
        {
            id: 'rules',
            path: 'rules',
            children: [
                {
                    id: 'rule-listing',
                    path: '',
                    Component: lazy(() => import('./rule'))
                },
                {
                    id: 'rule-create',
                    path: ':group/create',
                    Component: lazy(() => import('./rule/rule-form'))
                },
                {
                    id: 'rule-edit',
                    path: ':group/:id/edit',
                    Component: lazy(() => import('./rule/rule-form'))
                }
            ]
        }
    ]
} as RouteObject

export default routes