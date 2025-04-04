import { lazy } from "react";
import { RouteObject } from "react-router";
import ImportJobRepository from "../../core/repositories/import-job.repository";

const routes = {
  id: 'upload',
  path: 'upload',
  children: [
    {
      id: 'upload-list',
      path: '',
      Component: lazy(() => import('.'))
    },
    {
      id: 'upload-create',
      path: 'create',
      Component: lazy(() => import('./upload-form'))
    },
    {
      id: 'upload-results',
      path: ':slug/result',
      loader: async ( { params: { slug } } ) => {
        return ImportJobRepository.get(slug as string)
      },
      Component: lazy(() => import('./upload-detail'))
    },
    {
      id: 'upload-analyze',
      path: ':slug/analyze',
      loader: async ( { params: { slug } } ) => {
        return ImportJobRepository.get(slug as string)
      },
      Component: lazy(() => import('./upload-form'))
    }
  ]
} as RouteObject

export default routes
