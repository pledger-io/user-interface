import { lazy } from "react";
import { RouteObject } from "react-router";
import AccountRepository from "../../core/repositories/account-repository";

import liability from './liability/routes'

const routes = {
    id: 'accounts',
    path: 'accounts',
    children: [
        {
            id: 'owned-accounts',
            path: 'own',
            children: [
                {
                    id: 'own-list',
                    path: '',
                    Component: lazy(() => import('./own/index')),
                },
                {
                    id: 'owned-add',
                    path: 'add',
                    Component: lazy(() => import('./own/account-form')),
                },
                {
                    id: 'own-detail',
                    path: ':id',
                    children: [
                        {
                            id: 'own-detail-edit',
                            path: 'edit',
                            Component: lazy(() => import('./own/account-form')),
                        }
                    ]
                }
            ]
        },
        liability,
        {
            id: 'savings',
            path: 'savings/:id/transactions',
            children: [
                {
                    id: 'savings-transaction-list',
                    path: '',
                    Component: lazy(() => import('./saving')),
                },
                {
                    id: 'savings-transaction-list-monthly',
                    path: ':year/:month',
                    Component: lazy(() => import('./saving')),
                }
            ]
        },
        {
            id: 'other-accounts',
            path: ':type',
            loader: ({ params }) => {
                if (params.type == 'expense') {
                    return 'creditor'
                }
                if (params.type == 'revenue') {
                    return 'debtor'
                }

                return params.type
            },
            children: [
                {
                    id: 'other-list',
                    path: '',
                    Component: lazy(() => import('./default/index')),
                },
                {
                    id: 'other-add',
                    path: 'add',
                    Component: lazy(() => import('./default/account-form')),
                },
                {
                    id: 'other-detail',
                    path: ':id',
                    loader: async ({ params }) => {
                        return await AccountRepository.get(params.id)
                    },
                    children: [
                        {
                            id: 'other-detail-edit',
                            path: 'edit',
                            Component: lazy(() => import('./default/account-form')),
                        },
                        {
                            id: 'other-detail-overview',
                            path: 'transactions',
                            children: [
                                {
                                    id: 'other-transaction-list',
                                    path: '',
                                    Component: lazy(() => import('./account-details')),
                                },
                                {
                                    id: 'other-transaction-list-year',
                                    path: ':year/:month',
                                    Component: lazy(() => import('./account-details')),
                                },
                                {
                                    id: 'add-transaction',
                                    path: 'add/:transactionType',
                                    Component: lazy(() => import('./default/transaction-form')),
                                },
                                {
                                    id: 'edit-transaction',
                                    path: ':transactionId/edit',
                                    Component: lazy(() => import('./default/transaction-form')),
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
} as RouteObject

export default routes