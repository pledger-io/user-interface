import { PrimeReactContext } from "primereact/api";
import { createContext, FC, ReactNode, use, useEffect, useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { RouterAuthentication } from "../types/router-types";

export const Themes = {
  light: { value: 'light', message: 'Light', stylesheet: 'lara-light-blue' },
  dark: { value: 'dark', message: 'Dark', stylesheet: 'lara-dark-blue' },
  navy: { value: 'navy', message: 'Navy', stylesheet: 'saga-blue' },
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
  const { changeTheme } = use(PrimeReactContext);

  const context: ThemeContext = useMemo(() => ({
    setTheme: theme => {
      const previousTheme = Themes[currentTheme]
      const newTheme = Themes[theme]

      console.log('Changing theme', previousTheme, newTheme)
      changeTheme!(previousTheme.stylesheet, newTheme.stylesheet, 'theme-link')
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
