import { PrimeReactProvider } from "primereact/api";
import { useLocalStorage } from "primereact/hooks";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Outlet, useLocation, useNavigate } from "react-router";
import AppShellHeader from "../components/layout/app-shell-header";
import CommandLauncher, { CommandAction } from "../components/layout/command-launcher";
import Loading from "../components/layout/loading.component";
import Sidebar from "../components/sidebar";
import { i10n } from "../config/prime-locale";
import { NotificationProvider } from "../context/notification-context";
import { ThemeProvider } from "../context/theme-context";
import { SupportedLocales } from "../core/repositories/i18n-repository";
import SecurityRepository from "../core/repositories/security-repository";
import { resolveActiveSection, sectionDestinations, sectionDestinationsFor } from "../navigation/sections";

const isDesktopScreen = () => {
  if (!window.matchMedia) {
    return true
  }
  return window.matchMedia('(min-width: 768px)').matches
}

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
  const location = useLocation()
  const auth = useAuth();
  const [navigationOpen, setNavigationOpen] = useState(isDesktopScreen)
  const [commandLauncherOpen, setCommandLauncherOpen] = useState(false)

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

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandLauncherOpen(true)
      }
    }

    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [])

  useEffect(() => {
    if (!window.matchMedia) {
      return
    }
    const desktopMediaQuery = window.matchMedia('(min-width: 768px)')

    const onScreenSizeChanged = (event: MediaQueryListEvent) => {
      setNavigationOpen(event.matches)
    }

    desktopMediaQuery.addEventListener('change', onScreenSizeChanged)
    return () => desktopMediaQuery.removeEventListener('change', onScreenSizeChanged)
  }, [])

  const closeNavigation = () => {
    if (!isDesktopScreen()) {
      setNavigationOpen(false)
    }
  }

  const toggleNavigation = () => {
    if (!isDesktopScreen()) {
      setNavigationOpen(previous => !previous)
    }
  }

  const translate = (key: string) => {
    const translated = i10n(key)
    if (translated === key || translated.startsWith('_missing_localization_')) {
      return key
    }
    return translated
  }

  const activeSection = resolveActiveSection(location.pathname)
  const currentSectionDestinations = sectionDestinationsFor(activeSection)
  const commands: CommandAction[] = sectionDestinations.map(destination => {
    const label = translate(destination.labelKey)
    const description = translate(destination.descriptionKey)
    return {
      id: destination.id,
      section: destination.section,
      label,
      description,
      to: destination.to,
      icon: destination.icon,
      keywords: destination.keywords,
      aliases: destination.aliases,
      matchPrefixes: destination.matchPrefixes
    }
  })

  return <PrimeReactProvider value={ { ripple: true, locale: locale, cssTransition: true } }>
    <div className='flex h-screen overflow-hidden bg-background'>
      <ThemeProvider>
        <NotificationProvider>
          <Sidebar
            logoutCallback={ logout }
            isOpen={ navigationOpen }
            onClose={ closeNavigation }
          />
          <div className='flex min-h-0 grow flex-col'>
            <AppShellHeader
              onToggleNavigation={ toggleNavigation }
              onOpenCommandLauncher={ () => setCommandLauncherOpen(true) }
              sectionDestinations={ currentSectionDestinations }
            />
            <main className='min-h-0 grow overflow-y-auto'>
              <Suspense fallback={ <SuspenseLoading/> }>
                <Outlet/>
              </Suspense>
            </main>
          </div>
          <CommandLauncher
            visible={ commandLauncherOpen }
            commands={ commands }
            onHide={ () => setCommandLauncherOpen(false) }
          />
        </NotificationProvider>
      </ThemeProvider>
    </div>
  </PrimeReactProvider>
}
