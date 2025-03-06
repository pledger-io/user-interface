import SecurityRepository from "../core/repositories/security-repository";
import Sidebar from "../components/sidebar";
import MobileSidebar from "../components/sidebar/mobile-sidebar";
import NotificationCenter from "../components/notification";
import {Suspense} from "react";
import {Outlet} from "react-router";
import Loading from "../components/layout/loading.component";

function SuspenseLoading() {
    return <div className='flex h-[100vh] justify-center items-center'>
        <Loading />
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
    const logout = () => {
        SecurityRepository.logout()
    }

    return <>
        <Sidebar logoutCallback={ logout }/>
        <MobileSidebar logoutCallback={ logout }/>
        <main className='Main md:px-2 md:px-5 h-[100vh] flex flex-col overflow-y-auto'>
            <NotificationCenter/>
            <Suspense fallback={ <SuspenseLoading/> }>
                <Outlet/>
            </Suspense>
        </main>
    </>
}