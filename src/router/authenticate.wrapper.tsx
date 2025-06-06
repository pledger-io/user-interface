import { PrimeReactProvider } from "primereact/api";
import { useLocalStorage } from "primereact/hooks";
import { Suspense } from "react";
import { useAuth } from "react-oidc-context";
import { Outlet, useNavigate } from "react-router";
import Loading from "../components/layout/loading.component";
import Sidebar from "../components/sidebar";
import { SupportedLocales } from "../config/prime-locale";
import { NotificationProvider } from "../context/notification-context";
import { ThemeProvider } from "../context/theme-context";
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
  const auth = useAuth();

  const logout = () => {
    auth.signoutSilent();
    SecurityRepository.logout()
    navigate("/login")
  }

  return <PrimeReactProvider value={ { ripple: true, locale: locale, cssTransition: true } }>
    <div className='flex'>
      <ThemeProvider>
        <NotificationProvider>
          <Sidebar logoutCallback={ logout } className='w-[218px] min-w-[218px]'/>
          <main className='h-[100vh] flex flex-col overflow-y-auto flex-grow'>
            <Suspense fallback={ <SuspenseLoading/> }>
              <Outlet/>
            </Suspense>
          </main>
        </NotificationProvider>
      </ThemeProvider>
    </div>
  </PrimeReactProvider>
}
