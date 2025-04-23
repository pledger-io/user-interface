import { createContext, FC, ReactNode, use, useEffect, useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { RouterAuthentication } from "../types/router-types";

export const Themes = {
  light: { value: 'light', message: 'Light' },
  dark: { value: 'dark', message: 'Dark' },
  navy: { value: 'navy', message: 'Navy' }
}

type SupportedThemes = keyof typeof Themes;
type ThemeContext = {
  setTheme: (theme: SupportedThemes) => void,
}

type ThemeProviderProps = {
  children: ReactNode | ReactNode[]
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<SupportedThemes>('light');
  const profile: RouterAuthentication = useRouteLoaderData('authenticated')

  const context: ThemeContext = useMemo(() => ({
    setTheme: theme => {
      document.getElementById('theme-' + currentTheme)?.setAttribute('disabled', 'true')
      document.getElementById('theme-' + theme)?.removeAttribute('disabled')
      setCurrentTheme(theme)
    }
  }), [currentTheme])

  useEffect(() => {
    const defaultTheme: SupportedThemes = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    context.setTheme(profile?.user.theme as SupportedThemes || defaultTheme)
  }, [profile]);

  return <ThemeContext value={ context }>
    { children }
  </ThemeContext>
}

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
