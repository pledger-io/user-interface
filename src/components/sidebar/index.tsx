import {
  mdiArrowLeft,
  mdiBadgeAccountHorizontalOutline,
  mdiCalendarArrowRight,
  mdiCartOutline,
  mdiCashMultiple,
  mdiChartAreaspline,
  mdiChartBar,
  mdiChartLine,
  mdiChartPie,
  mdiChevronDown,
  mdiCogs,
  mdiCurrencyEur,
  mdiFileDocumentEdit,
  mdiFileUploadOutline,
  mdiFormatListBulletedSquare,
  mdiHandCoinOutline,
  mdiLogoutVariant,
  mdiMenu,
  mdiMonitorDashboard,
  mdiRobot,
  mdiShuffleVariant,
  mdiSwapHorizontal,
  mdiTune,
  mdiWallet
} from "@mdi/js";

import Icon from "@mdi/react";
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
                    <span className='flex gap-1'>
                        { icon && <Icon path={ icon } size={ .85 }/> }
                      <span className={ `font-medium ${ icon ? '' : 'uppercase' }` }>{ i10n(title) }</span>
                    </span>
        { icon && <Icon path={ mdiChevronDown } size={ .85 }/> }
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
      <Icon path={ icon } size={ .85 }/>
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
      <Icon path={ mdiMenu } size={ 1 }/>
    </div>
    <div className={ `opacity-0 absolute md:relative overflow-hidden md:flex md:opacity-100 flex-col surface-ground p-card !rounded-none ${ updatedClass } transition-all duration-300 ease-in-out h-[100vh]` }>
      <div className='px-3 mb-5 flex flex-row items-center relative !overflow-hidden py-2'>
        <img src='/ui/images/login-bg.png' className='absolute left-0 right-0 top-0 bottom-0 opacity-40 z-[1]'
             alt='background'/>
        <img className='w-[35px] h-[35px]'
             src={ logo } alt='logo'/>
        <span className='flex-grow pt-1 text-center text-lg'>
                Pledger<span className='text-[var(--app-text-muted-color)]'>.io</span>
            </span>
      </div>

      <div className="overflow-hidden overflow-y-auto flex-grow">
        <ul className="list-none p-3 m-0">
          <li>
            <Section title='page.nav.reports'>
              <SectionLink url='/dashboard' icon={ mdiMonitorDashboard }
                           onClick={ onClick }
                           title='page.nav.dashboard'/>
              <SectionLink url='/reports/income-expense' icon={ mdiChartAreaspline }
                           onClick={ onClick }
                           title='page.reports.default.title'/>
              <SectionLink url='/reports/monthly-budget' icon={ mdiChartPie }
                           onClick={ onClick }
                           title='page.reports.budget.title'/>
              <SectionLink url='/reports/monthly-category' icon={ mdiChartLine }
                           onClick={ onClick }
                           title='page.reports.category.title'/>
            </Section>
          </li>
          <li>
            <Section title='page.nav.finances'>
              <SectionLink url='/budgets' icon={ mdiFormatListBulletedSquare }
                           onClick={ onClick }
                           title='page.nav.budget.groups'/>
              <SectionLink url='/contracts' icon={ mdiFileDocumentEdit }
                           onClick={ onClick }
                           title='page.nav.budget.contracts'/>
            </Section>
          </li>
          <li>
            <Section title='page.nav.accounting'>
              <Section title='page.nav.transactions' icon={ mdiSwapHorizontal }>
                <SectionLink url='/transactions/income-expense' icon={ mdiArrowLeft }
                             onClick={ onClick }
                             title='page.nav.incomeexpense'/>
                <SectionLink url='/transactions/transfers' icon={ mdiSwapHorizontal }
                             onClick={ onClick }
                             title='page.nav.transfers'/>
              </Section>
              <Section title='page.nav.automation' icon={ mdiRobot }>
                <SectionLink url='/automation/schedule/transactions' icon={ mdiCalendarArrowRight }
                             onClick={ onClick }
                             title='page.nav.budget.recurring'/>
                <SectionLink url='/automation/schedule/rules' icon={ mdiShuffleVariant }
                             onClick={ onClick }
                             title='page.nav.settings.rules'/>
              </Section>
            </Section>
          </li>
          <li>
            <Section title='page.nav.settings'>
              <Section title='page.nav.accounts' icon={ mdiBadgeAccountHorizontalOutline }>
                <SectionLink url='/accounts/own' icon={ mdiWallet }
                             onClick={ onClick }
                             title='page.nav.accounts.accounts'/>
                <SectionLink url='/accounts/expense?page=1' icon={ mdiCartOutline }
                             onClick={ onClick }
                             title='page.nav.accounts.creditor'/>
                <SectionLink url='/accounts/revenue?page=1' icon={ mdiCashMultiple }
                             onClick={ onClick }
                             title='page.nav.accounts.debtor'/>
                <SectionLink url='/accounts/liability' icon={ mdiHandCoinOutline }
                             onClick={ onClick }
                             title='page.nav.accounts.liability'/>
              </Section>
              <Section title='page.nav.settings.options' icon={ mdiTune }>
                <SectionLink url='/settings/configure' icon={ mdiCogs }
                             onClick={ onClick }
                             title='page.header.application.settings'/>
                <SectionLink url='/settings/currencies' icon={ mdiCurrencyEur }
                             onClick={ onClick }
                             title='page.nav.settings.currencies'/>
              </Section>
              <SectionLink url='/categories' icon={ mdiChartBar }
                           onClick={ onClick }
                           title='page.nav.settings.categories'/>
              <SectionLink url='/upload' icon={ mdiFileUploadOutline }
                           onClick={ onClick }
                           title='page.nav.settings.import'/>
            </Section>
          </li>
        </ul>
      </div>

      <div className='flex p-2 border-t-1 items-center justify-between'>
        <NavLink to={ '/user/profile/currency' }>
          <Avatar shape="circle" image="/ui/images/user60.png"/>
        </NavLink>

        <a onClick={ logoutCallback } className='cursor-pointer'>
          <Icon path={ mdiLogoutVariant } size={ .85 }/>
        </a>
      </div>
    </div>
  </>
}

export default Sidebar
