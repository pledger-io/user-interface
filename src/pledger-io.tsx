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

import Sidebar from "./components/sidebar";
import MobileSidebar from "./components/sidebar/mobile-sidebar";
import Loading from "./components/layout/loading.component";
import NotificationCenter from "./components/notification";

import account from "./pages/account/routes";
import automation from "./pages/automation/routes";
import budget from "./pages/budget/routes";
import category from "./pages/category/routes";
import contract from "./pages/contract/routes";
import profile from "./pages/profile/routes";
import reports from "./pages/reports/routes";
import transactions from "./pages/transaction/routes";
import settings from "./pages/setting/routes";
import upload from "./pages/upload/routes";

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
            account,
            automation,
            budget,
            category,
            contract,
            profile,
            reports,
            transactions,
            settings,
            upload,
            {
                id: 'catch-all',
                path: '/*',
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

    console.log('error', error)

    if (!isRouteErrorResponse(error) && (error as any).response.status === 403) {
        // todo this does not work. Need to figure out a way to do a proper route redirect
        navigate('/two-factor')
        return <></>
    } else if (!isRouteErrorResponse(error) && (error as any).response.status === 401) {
        SecurityRepository.logout()
        window.location.reload()
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