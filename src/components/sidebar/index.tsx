import { Icon } from "@iconify-icon/react";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { StyleClass } from "primereact/styleclass";
import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import logo from '../../assets/logo.png'
import { i10n } from "../../config/prime-locale";


type SidebarProps = {
  logoutCallback: () => void,
  className?: string
}

const Section = ({ title, icon, children }: any) => {
  const sectionRef = useRef<any>(null);

  return <>
    <StyleClass nodeRef={ sectionRef } selector="@next" enterFromClassName="hidden" leaveToClassName="hidden">
      <div ref={ sectionRef }
           className={ `p-ripple py-2 flex items-center justify-between text-600 ${ icon ? 'px-2 cursor-pointer hover:bg-blue-100/40 hover:text-gray-400 transition-all' : '' }` }>
                    <span className='flex gap-1 items-center'>
                        { icon && <Icon icon={ icon } width='1.2em'/> }
                      <span className={ `font-medium ${ icon ? '' : 'uppercase' }` }>{ i10n(title) }</span>
                    </span>
        { icon && <Icon icon={ 'mdi:chevron-down' } width='1em'/> }
        <Ripple/>
      </div>
    </StyleClass>
    <ul className={ `list-none p-0 m-0 ${ icon ? 'hidden pl-2' : '' }` }>
      { children }
    </ul>
  </>
}

const SectionLink = ({ url, icon, title, onClick }: any) => {
  return <li>
    <NavLink to={ url }
             onClick={ onClick }
             className="p-ripple flex gap-1 items-center cursor-pointer px-2 py-2 border-round text-700 hover:bg-blue-100/40 hover:text-gray-400 transition-all">
      <Icon icon={ icon } width='1.2em'/>
      <span className="font-medium">{ i10n(title) }</span>
      <Ripple/>
    </NavLink>
  </li>
}

const Sidebar = ({ logoutCallback, className }: SidebarProps) => {
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false)

  let updatedClass = className
  if (hamburgerOpen) updatedClass = `${ updatedClass } !flex absolute top-0 left-0 w-full h-full bg-white z-10 opacity-100`
  const onClick = () => {
    if (hamburgerOpen) {
      setHamburgerOpen(false)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 500) {
        setHamburgerOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <>
    <div
      onClick={ () => setHamburgerOpen(!hamburgerOpen) }
      className={ `md:hidden absolute top-2 right-2 rounded-full bg-gray-400 p-1 opacity-25 hover:opacity-100 transition-all cursor-pointer z-11` }>
      <Icon icon={ 'mdi:menu' } size={ 1 }/>
    </div>
    <div className={ `opacity-0 absolute md:relative overflow-hidden md:flex md:opacity-100 flex-col surface-ground p-card rounded-none! ${ updatedClass } transition-all duration-300 ease-in-out h-screen` }>
      <div className='px-3 mb-5 flex flex-row items-center relative overflow-hidden! py-2'>
        <img src='/ui/images/login-bg.png' className='absolute left-0 right-0 top-0 bottom-0 opacity-40 z-1'
             alt='background'/>
        <img className='w-8.75 h-8.75'
             src={ logo } alt='logo'/>
        <span className='grow pt-1 text-center text-lg'>
                Pledger<span className='text-muted'>.io</span>
            </span>
      </div>

      <div className="overflow-hidden overflow-y-auto grow">
        <ul className="list-none p-3 m-0">
          <li>
            <Section title='page.nav.reports'>
              <SectionLink url='/dashboard' icon={ 'mdi:monitor-dashboard' }
                           onClick={ onClick }
                           title='page.nav.dashboard'/>
              <SectionLink url='/reports/income-expense' icon={ 'mdi:home-analytics' }
                           onClick={ onClick }
                           title='page.reports.default.title'/>
              <SectionLink url='/reports/monthly-budget' icon={ 'mdi:chart-pie' }
                           onClick={ onClick }
                           title='page.reports.budget.title'/>
              <SectionLink url='/reports/monthly-category' icon={ 'mdi:chart-line' }
                           onClick={ onClick }
                           title='page.reports.category.title'/>
            </Section>
          </li>
          <li>
            <Section title='page.nav.finances'>
              <SectionLink url='/budgets' icon={ 'mdi:format-list-bulleted-square' }
                           onClick={ onClick }
                           title='page.nav.budget.groups'/>
              <SectionLink url='/contracts' icon={ 'mdi:file-document-edit' }
                           onClick={ onClick }
                           title='page.nav.budget.contracts'/>
              <SectionLink url='/reports/spending-insight' icon={ 'mdi:chart-areaspline' }
                           onClick={ onClick }
                           title='page.reports.insights.title'/>
            </Section>
          </li>
          <li>
            <Section title='page.nav.accounting'>
              <Section title='page.nav.transactions' icon={ 'mdi:swap-horizontal' }>
                <SectionLink url='/transactions/income-expense' icon={ 'mdi:arrow-left' }
                             onClick={ onClick }
                             title='page.nav.incomeexpense'/>
                <SectionLink url='/transactions/transfers' icon={ 'mdi:swap-horizontal' }
                             onClick={ onClick }
                             title='page.nav.transfers'/>
              </Section>
              <Section title='page.nav.automation' icon={ 'mdi:robot' }>
                <SectionLink url='/automation/schedule/transactions' icon={ 'mdi:calendar-arrow-right' }
                             onClick={ onClick }
                             title='page.nav.budget.recurring'/>
                <SectionLink url='/automation/schedule/rules' icon={ 'mdi:shuffle-variant' }
                             onClick={ onClick }
                             title='page.nav.settings.rules'/>
              </Section>
            </Section>
          </li>
          <li>
            <Section title='page.nav.settings'>
              <Section title='page.nav.accounts' icon={ 'mdi:badge-account-horizontal-outline' }>
                <SectionLink url='/accounts/own' icon={ 'mdi:wallet' }
                             onClick={ onClick }
                             title='page.nav.accounts.accounts'/>
                <SectionLink url='/accounts/expense?page=1' icon={ 'mdi:cart-outline' }
                             onClick={ onClick }
                             title='page.nav.accounts.creditor'/>
                <SectionLink url='/accounts/revenue?page=1' icon={ 'mdi:cash-multiple' }
                             onClick={ onClick }
                             title='page.nav.accounts.debtor'/>
                <SectionLink url='/accounts/liability' icon={ 'mdi:hand-coin-outline' }
                             onClick={ onClick }
                             title='page.nav.accounts.liability'/>
              </Section>
              <Section title='page.nav.settings.options' icon={ 'mdi:tune' }>
                <SectionLink url='/settings/configure' icon={ 'mdi-cogs' }
                             onClick={ onClick }
                             title='page.header.application.settings'/>
                <SectionLink url='/settings/currencies' icon={ 'mdi-currency-eur' }
                             onClick={ onClick }
                             title='page.nav.settings.currencies'/>
              </Section>
              <SectionLink url='/categories' icon={ 'mdi-chart-bar' }
                           onClick={ onClick }
                           title='page.nav.settings.categories'/>
              <SectionLink url='/upload' icon={ 'mdi-file-upload-outline' }
                           onClick={ onClick }
                           title='page.nav.settings.import'/>
            </Section>
          </li>
        </ul>
      </div>

      <div className='flex p-2 border-t items-center justify-between'>
        <NavLink to={ '/user/profile/currency' }>
          <Avatar shape="circle" image="/ui/images/user60.png"/>
        </NavLink>

        <a onClick={ logoutCallback } className='cursor-pointer'>
          <Icon icon={ 'mdi:logout-variant' } size={ .85 }/>
        </a>
      </div>
    </div>
  </>
}

export default Sidebar
