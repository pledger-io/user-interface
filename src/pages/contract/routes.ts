import { lazy } from "react";
import ContractRepository from "../../core/repositories/contract-repository";
import { RouteObject } from "react-router";

const routes: RouteObject = {
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
      Component: lazy(() => import('./contract-form')),
      loader: async () => {
        return {}
      },
    },
    {
      id: 'contract-edit',
      path: ':id/edit',
      Component: lazy(() => import('./contract-form')),
      loader: async ({ params }: any) => {
        return await ContractRepository.get(params.id)
      }
    },
    {
      id: 'contract-view',
      path: ':id',
      Component: lazy(() => import('./contract-details'))
    }
  ]
}

export default routes;
