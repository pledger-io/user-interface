import { Icon } from "@iconify-icon/react";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { i10n } from "../../config/prime-locale";
import { navigationSections, resolveActiveSection } from "../../navigation/sections";
import React from "react";
import { NavLink, useLocation } from "react-router";
import logo from '../../assets/logo.png'
type SidebarProps = {
  logoutCallback: () => void
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ logoutCallback, isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const navigationHidden = !isOpen
  const activeSection = resolveActiveSection(location.pathname)
  const translate = (key: string) => {
    const translated = i10n(key)
    if (translated === key || translated.startsWith('_missing_localization_')) {
      return key
    }
    return translated
  }

  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return <>
    { isOpen && <button
      type='button'
      aria-label={ translate('a11y.navigation.close') }
      onClick={ onClose }
      className='fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden opacity-100'
    /> }
    <aside
      className={ `fixed inset-y-0 left-0 z-40 h-screen w-64 border-r border-separator bg-background transition-transform duration-200 md:sticky md:top-0 md:translate-x-0 ${ isOpen ? 'translate-x-0' : '-translate-x-full' }` }
      aria-hidden={ navigationHidden }
      aria-label={ translate('a11y.navigation.label') }
      inert={ navigationHidden }>
      <div className='flex h-full flex-col'>
        <div className='px-3 py-3 border-b border-separator flex flex-row items-center gap-2 relative overflow-hidden'>
          <img src='/ui/images/login-bg.png' className='absolute left-0 right-0 top-0 bottom-0 opacity-20'
               alt={ translate('a11y.image.background') }/>
          <img className='w-8 h-8 z-1'
               src={ logo } alt={ translate('a11y.image.logo') }/>
          <span className='z-1 text-lg font-semibold'>
            Pledger<span className='text-muted'>.io</span>
          </span>
        </div>

        <nav className='grow overflow-y-auto px-2 py-3'>
          <ul className='list-none p-0 m-0 flex flex-col gap-1'>
            { navigationSections.map(item => {
              const active = item.id === activeSection
              return <li key={ item.to } className='rounded-md border border-transparent p-1'>
                <NavLink
                  to={ item.to }
                  onClick={ onClose }
                  tabIndex={ navigationHidden ? -1 : 0 }
                  className={ `p-ripple relative flex items-center gap-2 rounded-md px-3 py-2 font-medium transition-all ${
                    active
                      ? 'bg-blue-100/60 text-blue-900'
                      : 'text-700 hover:bg-blue-100/40 hover:text-gray-900'
                  }` }>
                  <Icon icon={ item.icon } width='1.2em'/>
                  <span>{ translate(item.labelKey) }</span>
                  <Ripple/>
                </NavLink>
              </li>
            }) }
          </ul>
        </nav>

        <div className='flex p-2 border-t border-separator items-center justify-between'>
          <NavLink to={ '/user/profile/currency' } onClick={ onClose } tabIndex={ navigationHidden ? -1 : 0 }>
            <Avatar shape="circle" image="/ui/images/user60.png"/>
          </NavLink>

          <button
            type='button'
            aria-label={ translate('page.header.user.logout') }
            tabIndex={ navigationHidden ? -1 : 0 }
            onClick={ logoutCallback }
            className='cursor-pointer bg-transparent border-none'>
            <Icon icon={ 'mdi:logout-variant' } width='1.1em'/>
          </button>
        </div>
      </div>
    </aside>
  </>
}

export default Sidebar
