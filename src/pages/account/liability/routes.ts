import { lazy } from "react";
import { RouteObject } from "react-router";
import AccountRepository from "../../../core/repositories/account-repository";
import { TransactionRepository } from "../../../core/RestAPI";

const routes = {
    id: 'liability-accounts',
    path: 'liability',
    children: [
        {
            id: 'liability-list',
            path: '',
            Component: lazy(() => import('./index')),
        },
        {
            id: 'liability-add',
            path: 'add',
            Component: lazy(() => import('./liability-form')),
        },
        {
            id: 'liability',
            path: ':id',
            loader: async ({ params }) => {
                return await AccountRepository.get(params.id)
            },
            children: [
                {
                    id: 'liability-detail',
                    path: '',
                    Component: lazy(() => import('./liability-detail')),
                },
                {
                    id: 'liability-edit',
                    path: 'edit',
                    Component: lazy(() => import('./liability-form')),
                },
                {
                    id: 'liability-transaction-add',
                    path: 'transactions/add',
                    Component: lazy(() => import('./payment-form')),
                    loader: () => {
                        return {
                            transaction: {
                                id: NaN
                            }
                        }
                    }
                },
                {
                    id: 'liability-transaction-edit',
                    path: 'transactions/:transactionId/edit',
                    Component: lazy(() => import('./payment-form')),
                    loader: async ({ params }) => {
                        return await TransactionRepository.get(params.id, params.transactionId)
                    }
                }
            ]
        }
    ]
} as RouteObject

export default routes