import { PrimeReactProvider } from "primereact/api";
import { useLocalStorage } from "primereact/hooks";
import { Suspense, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Outlet, useNavigate } from "react-router";
import Loading from "../components/layout/loading.component";
import Sidebar from "../components/sidebar";
import { NotificationProvider } from "../context/notification-context";
import { ThemeProvider } from "../context/theme-context";
import { SupportedLocales } from "../core/repositories/i18n-repository";
import SecurityRepository from "../core/repositories/security-repository";

/**
 * A React component that displays a loading state with a flex container
 * centered horizontally and vertically, occupying the full height of the viewport.
 */
function SuspenseLoading() {
  return <div className='flex h-screen justify-center items-center'>
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

  useEffect(() => {
    const onTokenExpired = () => {
      console.warn("Users credentials expired and should be refreshed.")
      if (auth.isAuthenticated) {
        sessionStorage.setItem('token', auth.user?.access_token as string);
      } else {
        SecurityRepository.refresh(sessionStorage.getItem('refresh-token'));
      }
    }

    window.addEventListener('credentials-expired', onTokenExpired);
    return () => window.removeEventListener('credentials-expired', onTokenExpired);
  }, [])

  return <PrimeReactProvider value={ { ripple: true, locale: locale, cssTransition: true } }>
    <div className='flex'>
      <ThemeProvider>
        <NotificationProvider>
          <Sidebar logoutCallback={ logout } className='w-54.5 min-w-54.5'/>
          <main className='h-screen flex flex-col overflow-y-auto grow'>
            <Suspense fallback={ <SuspenseLoading/> }>
              <Outlet/>
            </Suspense>
          </main>
        </NotificationProvider>
      </ThemeProvider>
    </div>
  </PrimeReactProvider>
}
