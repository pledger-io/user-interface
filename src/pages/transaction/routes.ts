import { lazy } from "react";
import { RouteObject } from "react-router";
import { lookup_entity } from "../../components/lookup-name.util";
import { TransactionFilter } from "../../components/transaction/list-filters.component";

const routes = {
  id: 'global-transaction',
  path: 'transactions',
  children: [
    {
      id: 'income-expense',
      path: 'income-expense',
      loader: async ({ request }) => {
        const queryParams = new URL(request.url).searchParams
        const params = Object.fromEntries(queryParams.entries())
        return {
          searchCommand: {
            budget: params.budget ? await lookup_entity('BUDGET', params.budget) : undefined,
          } as TransactionFilter
        }
      },
      children: [
        {
          id: 'income-expense-list',
          path: '',
          Component: lazy(() => import('./income-expense'))
        },
        {
          id: 'income-expense-list-year',
          path: ':year',
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
