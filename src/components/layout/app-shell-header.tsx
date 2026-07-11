import { Icon } from "@iconify-icon/react";
import React from "react";
import { useLocalStorage } from "primereact/hooks";
import { NavLink, useLocation } from "react-router";
import { i10n } from "../../config/prime-locale";
import { SupportedLocales } from "../../core/repositories/i18n-repository";
import { navigationSections, resolveActiveSection, SectionDestination } from "../../navigation/sections";
import SectionLocalNav from "./section-local-nav";

type AppShellHeaderProps = {
  onToggleNavigation: () => void
  onOpenCommandLauncher: () => void
  sectionDestinations: SectionDestination[]
}

const translate = (key: string) => {
  const translated = i10n(key)
  if (translated === key || translated.startsWith('_missing_localization_')) {
    return key
  }
  return translated
}

const currentMonthContext = (language: SupportedLocales) => {
  return new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(new Date())
}

const AppShellHeader = ({ onToggleNavigation, onOpenCommandLauncher, sectionDestinations }: AppShellHeaderProps) => {
  const location = useLocation()
  const [language] = useLocalStorage<SupportedLocales>('en', 'language')
  const activeSection = resolveActiveSection(location.pathname)
  const titleKey = navigationSections.find(section => section.id === activeSection)?.labelKey ?? 'page.nav.dashboard'
  const title = translate(titleKey)

  return <header className='sticky top-0 z-20 border-b border-separator bg-background/95 px-3 py-2 backdrop-blur-sm'>
    <div className='flex items-center gap-2'>
      <button
        type='button'
        aria-label={ translate('a11y.navigation.open') }
        onClick={ onToggleNavigation }
        className='ui-interactive-surface md:hidden rounded-md border border-separator bg-transparent p-2'>
        <Icon icon='mdi:menu' width='1.2em'/>
      </button>

      <div className='min-w-0'>
        <div className='truncate text-lg font-semibold'>{ title }</div>
        <div className='text-xs text-muted'>{ currentMonthContext(language) }</div>
      </div>

      <div className='ml-auto flex items-center gap-2'>
        <button
          type='button'
          aria-label={ translate('a11y.command.open') }
          onClick={ onOpenCommandLauncher }
          className='ui-interactive-surface inline-flex items-center gap-2 rounded-md border border-separator bg-background px-2 py-2 text-sm'>
          <Icon icon='mdi:magnify' width='1em'/>
          <span className='hidden sm:inline'>{ translate('common.action.search') }</span>
          <span className='hidden rounded border border-separator px-1 text-xs text-muted md:inline'>{ translate('layout.command.shortcut') }</span>
        </button>

        <NavLink
          to='/upload/create'
          className='ui-interactive-surface hidden md:inline-flex items-center gap-1 rounded-md border border-separator bg-background px-2 py-2 text-sm'>
          <Icon icon='mdi:file-upload-outline' width='1em'/>
          <span>{ translate('page.nav.settings.import') }</span>
        </NavLink>

        <NavLink
          to='/reports/spending-insight'
          className='ui-interactive-surface hidden md:inline-flex items-center gap-1 rounded-md border border-separator bg-background px-2 py-2 text-sm'>
          <Icon icon='mdi:chart-areaspline' width='1em'/>
          <span>{ translate('page.reports.insights.title') }</span>
        </NavLink>
      </div>
    </div>
    <div className='mt-2 flex flex-wrap items-center gap-2 md:hidden'>
      <NavLink
        to='/upload/create'
        className='ui-interactive-surface inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md border border-separator bg-background px-2 py-1.5 text-sm'>
        <Icon icon='mdi:file-upload-outline' width='1em'/>
        <span className='truncate'>{ translate('page.nav.settings.import') }</span>
      </NavLink>
      <NavLink
        to='/reports/spending-insight'
        className='ui-interactive-surface inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md border border-separator bg-background px-2 py-1.5 text-sm'>
        <Icon icon='mdi:chart-areaspline' width='1em'/>
        <span className='truncate'>{ translate('page.reports.insights.title') }</span>
      </NavLink>
    </div>
    <SectionLocalNav destinations={ sectionDestinations }/>
  </header>
}

export default AppShellHeader
