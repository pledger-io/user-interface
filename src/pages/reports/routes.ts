import { lazy } from "react";
import { RouteObject } from "react-router";
import BudgetRepository from "../../core/repositories/budget.repository";

const routes = {
  id: 'reports',
  path: 'reports',
  children: [
    {
      id: 'budget-reports',
      path: 'monthly-budget',
      loader: async () => {
        const firstBudget = await (BudgetRepository.firstBudget().catch(() => null));
        return {
          firstBudget,
        }
      },
      children: [
        {
          id: 'report-budget-balance',
          path: '',
          Component: lazy(() => import('./budget-monthly'))
        },
        {
          id: 'report-budget-balance-monthly',
          path: ':year/:currency',
          Component: lazy(() => import('./budget-monthly'))
        },
      ]
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
    {
      id: 'spending-insight',
      path: 'spending-insight',
      Component: lazy(() => import('./spending-insights'))
    },
    {
      id: 'spending-insight-monthly',
      path: 'spending-insight/:year/:month',
      Component: lazy(() => import('./spending-insights'))
    },
  ]
} as RouteObject

export default routes;