import { PrimeReactProvider } from "primereact/api";
import { useLocalStorage } from "primereact/hooks";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router";
import Loading from "../components/layout/loading.component";
import NotificationCenter from "../components/notification";
import Sidebar from "../components/sidebar";
import { SupportedLocales } from "../config/prime-locale";
import SecurityRepository from "../core/repositories/security-repository";

/**
 * A React component that displays a loading state with a flex container
 * centered horizontally and vertically, occupying the full height of the viewport.
 */
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
  const [locale] = useLocalStorage<SupportedLocales>('en', 'language')
  const navigate = useNavigate()

  const logout = () => {
    SecurityRepository.logout()
    navigate("/login")
  }

  return <PrimeReactProvider value={ { ripple: true, locale: locale, cssTransition: true } }>
    <div className='flex'>
      <Sidebar logoutCallback={ logout } className='w-[218px] min-w-[218px]'/>
      <main className='h-[100vh] flex flex-col overflow-y-auto flex-grow'>
        <NotificationCenter/>
        <Suspense fallback={ <SuspenseLoading/> }>
          <Outlet/>
        </Suspense>
      </main>
    </div>
  </PrimeReactProvider>
}
