import {
    createBrowserRouter,
    isRouteErrorResponse,
    LoaderFunctionArgs,
    Outlet,
    redirect,
    RouterProvider,
    useNavigate,
    useRouteError
} from "react-router-dom";
import { lazy, Suspense } from "react";

import SecurityRepository from "./core/repositories/security-repository";
import RestAPI from "./core/repositories/rest-api";
import { CurrencyRepository } from "./core/RestAPI";

import Sidebar from "./core/sidebar";
import MobileSidebar from "./core/sidebar/mobile-sidebar";
import Loading from "./components/layout/loading.component";
import NotificationCenter from "./components/notification";

const router = createBrowserRouter([
    {
        id: 'login',
        path: '/login',
        Component: lazy(() => import('./pages/login')),
        loader: anonymousLoader
    },
    {
        id: 'register',
        path: '/register',
        Component: lazy(() => import('./pages/register')),
        loader: anonymousLoader
    },
    {
        id: 'two-factor',
        path: '/two-factor',
        Component: lazy(() => import('./pages/two-factor')),
    },
    {
        id: 'pledger',
        path: '/',
        Component: AuthenticatedComponent,
        loader: authenticatedLoader,
        errorElement: <RootErrorBoundary/>,
        children: [
            {
                id: 'dashboard',
                path: 'dashboard',
                Component: lazy(() => import('./pages/dashboard'))
            },
            {
                id: 'accounts',
                path: 'accounts',
                children: [
                    {
                        id: 'owned-accounts',
                        path: 'own'
                    },
                    {
                        id: 'liability-accounts',
                        path: 'liability'
                    },
                    {
                        id: 'other-accounts',
                        path: ':type',
                        loader: ({ params }) => {
                            return {
                                type: params.type === 'expense'
                                    ? 'creditor'
                                    : 'debtor'
                            }
                        }
                    }
                ]
            },
            {
                id: 'reports',
                path: 'reports',
                children: [
                    {
                        id: 'budget-balance',
                        path: 'monthly-budget',
                        Component: lazy(() => import('./pages/reports/budget-monthly'))
                    },
                    {
                        id: 'budget-balance-monthly',
                        path: 'monthly-budget/:year/:currency',
                        Component: lazy(() => import('./pages/reports/budget-monthly'))
                    },
                    {
                        id: 'income-expense',
                        path: 'income-expense',
                        Component: lazy(() => import('./pages/reports/income-expense'))
                    },
                    {
                        id: 'income-expense-monthly',
                        path: 'income-expense/:year/:currency',
                        Component: lazy(() => import('./pages/reports/income-expense'))
                    },
                    {
                        id: 'category-balance',
                        path: 'monthly-category',
                        Component: lazy(() => import('./pages/reports/category-monthly'))
                    },
                    {
                        id: 'category-balance-monthly',
                        path: 'monthly-category/:year/:currency',
                        Component: lazy(() => import('./pages/reports/category-monthly'))
                    },
                ]
            },
            {
                id: 'categories',
                path: 'categories',
                children: [
                    {
                        id: 'category-list',
                        path: '',
                        Component: lazy(() => import('./pages/category')),
                    },
                    {
                        id: 'category-add',
                        path: 'add',
                        Component: lazy(() => import('./pages/category/category-form'))
                    },
                    {
                        id: 'category-edit',
                        path: ':id/edit',
                        Component: lazy(() => import('./pages/category/category-form'))
                    }
                ]
            },
            {
                id: 'contracts',
                path: 'contracts',
                children: [
                    {
                        id: 'contract-list',
                        path: '',
                        Component: lazy(() => import('./pages/contract')),
                    },
                    {
                        id: 'contract-add',
                        path: 'create',
                        Component: lazy(() => import('./pages/contract/contract-form'))
                    },
                    {
                        id: 'contract-edit',
                        path: ':id/edit',
                        Component: lazy(() => import('./pages/contract/contract-form'))
                    },
                    {
                        id: 'contract-view',
                        path: ':id',
                        Component: lazy(() => import('./pages/contract/contract-details'))
                    }
                ]
            },
            {
                id: 'catch-all',
                path: '*',
                loader: () => redirect('/dashboard')
            }
        ]
    }
], {
    basename: '/ui'
})

// todo the functions below should be moved to a separate file

function anonymousLoader({ request }: LoaderFunctionArgs) {
    const [from] = new URLSearchParams(request.url).get("from") || "/dashboard"
    if (SecurityRepository.isAuthenticated()) {
        return redirect(from);
    }
    return null;

}

async function authenticatedLoader({ request }: LoaderFunctionArgs) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname.replace("/ui", ""));
    if (!SecurityRepository.isAuthenticated()) {
        return redirect("/login?" + params.toString());
    }

    await RestAPI.profile()
    const profile = RestAPI.user() as any
    await CurrencyRepository.list()
    profile.defaultCurrency = CurrencyRepository.cached(profile.currency)
    return {
        user: profile
    }
}

function AuthenticatedComponent() {
    const logout = () => {
        SecurityRepository.logout()
    }

    return <>
        <Sidebar logoutCallback={ logout }/>
        <MobileSidebar logoutCallback={ logout }/>
        <main className='Main px-2 md:px-5 h-[100vh] flex flex-col overflow-y-auto'>
            <NotificationCenter/>
            <Suspense fallback={ <SuspenseLoading/> }>
                <Outlet/>
            </Suspense>
        </main>
    </>
}

function RootErrorBoundary() {
    const error = useRouteError()
    const navigate = useNavigate()

    if (!isRouteErrorResponse(error) && (error as any).status === 401) {
        navigate('/two-factor')
        return <></>
    }

    return <></>
}

function SuspenseLoading() {
    return <div className='flex h-[100vh] justify-center items-center'>
        <Loading />
    </div>
}

function _() {
    return (
        <RouterProvider router={ router }
                        fallbackElement={ <Loading/> }/>
    )
}

export default _;