import SecurityRepository from "../core/repositories/security-repository";
import NotificationCenter from "../components/notification";
import {Suspense, useEffect, useState} from "react";
import {Outlet} from "react-router";
import Loading from "../components/layout/loading.component";
import Sidebar from "../components/sidebar";
import {PrimeReactProvider} from "primereact/api";

function SuspenseLoading() {
    return <div className='flex h-[100vh] justify-center items-center'>
        <Loading/>
    </div>
}

/**
 * Component that displays authenticated content including a sidebar, mobile sidebar, main content area,
 * notification center, and dynamic content based on user's role.
 * Allows user to logout by calling SecurityRepository.logout() method.
 *
 * @return the authenticated component to be rendered in the application
 */
export function AuthenticatedComponent() {
    const [locale, setLocale] = useState(() => localStorage.getItem("language") || "en")
    const logout = () => {
        SecurityRepository.logout()
    }

    useEffect(() => {
        const localeChange = () => setLocale(localStorage.getItem("language") || "en")
        document.addEventListener("locale-changed", localeChange)

        return () => document.removeEventListener("locale-changed", localeChange)
    }, [])

    return <PrimeReactProvider value={ { ripple: true, locale: locale, cssTransition: true} }>
        <div className='flex'>
            <Sidebar logoutCallback={logout} className='w-[218px] min-w-[218px]'/>
            <main className='h-[100vh] flex flex-col overflow-y-auto flex-grow'>
                <NotificationCenter/>
                <Suspense fallback={<SuspenseLoading/>}>
                    <Outlet/>
                </Suspense>
            </main>
        </div>
    </PrimeReactProvider>
}