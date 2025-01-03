import { lazy } from "react";
import { RouteObject } from "react-router";
import { TransactionScheduleRepository } from "../../../core/RestAPI";

const routes = {
    id: 'scheduled-transactions',
    path: 'transactions',
    children: [
        {
            id: 'scheduled-transactions-list',
            path: '',
            Component: lazy(() => import('./overview')),
        },
        {
            id: 'edit-scheduled-transaction',
            path: ':id/edit',
            Component: lazy(() => import('./schedule-form')),
            loader: async ({ params }) => {
                return await TransactionScheduleRepository.get(params.id)
            }
        },
    ]
} as RouteObject

export default routes