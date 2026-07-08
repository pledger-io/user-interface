import { Icon } from "@iconify-icon/react";
import React, { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { NavLink, useLocation } from "react-router";
import { i10n } from "../../config/prime-locale";
import { SectionDestination } from "../../navigation/sections";

type SectionLocalNavProps = {
  destinations: SectionDestination[]
}

const SectionLocalNav = ({ destinations }: SectionLocalNavProps) => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeDestinationId = useMemo(() => {
    const matches = destinations
      .filter(destination => destination.matchPrefixes.some(prefix => location.pathname.startsWith(prefix)))
      .sort((first, second) => {
        const firstLength = Math.max(...first.matchPrefixes.map(prefix => prefix.length))
        const secondLength = Math.max(...second.matchPrefixes.map(prefix => prefix.length))
        return secondLength - firstLength
      })

    return matches[0]?.id
  }, [destinations, location.pathname])

  if (destinations.length <= 1) {
    return null
  }

  const translate = (key: string) => {
    const translated = i10n(key)
    if (translated === key || translated.startsWith('_missing_localization_')) {
      return key
    }
    return translated
  }

  const sectionPagesLabel = translate('layout.navigation.section.pages')
  const activeLabel = destinations.find(destination => destination.id === activeDestinationId)?.labelKey

  return <div className='mt-3'>
    <div className='hidden md:flex items-center gap-1 overflow-x-auto pb-1'>
      { destinations.map(destination => {
        const active = destination.id === activeDestinationId
        return <NavLink
          key={ destination.id }
          to={ destination.to }
          className={ `whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
            active
              ? 'bg-blue-100/60 text-blue-900 font-medium'
              : 'text-700 hover:bg-blue-100/30 hover:text-gray-900'
          }` }>
          { translate(destination.labelKey) }
        </NavLink>
      }) }
    </div>

    <div className='md:hidden'>
      <button
        type='button'
        aria-label={ translate('a11y.navigation.section.open') }
        aria-expanded={ mobileMenuOpen }
        onClick={ () => setMobileMenuOpen(true) }
        className='w-full rounded-md border border-separator bg-background px-3 py-2 text-left text-sm'>
        <span className='text-muted'>{ sectionPagesLabel }</span>
        { activeLabel && <span className='ml-2 font-medium text-900'>{ translate(activeLabel) }</span> }
      </button>
      <Dialog
        header={ sectionPagesLabel }
        visible={ mobileMenuOpen }
        onHide={ () => setMobileMenuOpen(false) }
        position='bottom'
        className='w-[95vw] max-w-xl'
        dismissableMask
        closeOnEscape>
        <div className='flex flex-col gap-1'>
          { destinations.map(destination => {
            const active = destination.id === activeDestinationId
            return <NavLink
              key={ destination.id }
              to={ destination.to }
              onClick={ () => setMobileMenuOpen(false) }
              className={ `flex items-center gap-2 rounded-md px-3 py-2 ${
                active
                  ? 'bg-blue-100/60 text-blue-900 font-medium'
                  : 'text-700 hover:bg-blue-100/30 hover:text-gray-900'
              }` }>
              <Icon icon={ destination.icon } width='1.1em'/>
              <span>{ translate(destination.labelKey) }</span>
            </NavLink>
          }) }
        </div>
      </Dialog>
    </div>
  </div>
}

export default SectionLocalNav
