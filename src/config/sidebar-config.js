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
  mdiCogs,
  mdiCurrencyUsd,
  mdiFileDocumentEdit,
  mdiFileUploadOutline,
  mdiFormatListBulletedSquare,
  mdiHandCoinOutline,
  mdiMonitorDashboard,
  mdiScaleBalance,
  mdiShuffleVariant,
  mdiSwapHorizontal,
  mdiTune,
  mdiWallet
} from "@mdi/js";


const config = [
  {
    type: 'button',
    icon: mdiMonitorDashboard,
    href: '/dashboard',
    label: 'page.nav.dashboard'
  },
  {
    type: 'section',
    icon: mdiChartBar,
    label: 'page.nav.reports',
    links: [
      {
        href: '/reports/income-expense',
        label: 'page.reports.default.title',
        icon: mdiChartAreaspline
      },
      {
        href: '/reports/monthly-budget',
        label: 'page.reports.budget.title',
        icon: mdiChartPie
      },
      {
        href: '/reports/monthly-category',
        label: 'page.reports.category.title',
        icon: mdiChartLine
      }
    ]
  },
  {
    type: 'divider',
    label: 'page.nav.finances'
  },
  {
    type: 'button',
    icon: mdiFormatListBulletedSquare,
    label: 'page.nav.budget.groups',
    href: '/budgets'
  },
  {
    type: 'button',
    icon: mdiFileDocumentEdit,
    label: 'page.nav.budget.contracts',
    href: '/contracts'
  },
  {
    type: 'divider',
    label: 'page.nav.accounting'
  },
  {
    type: 'section',
    icon: mdiSwapHorizontal,
    label: 'page.nav.transactions',
    links: [
      {
        icon: mdiArrowLeft,
        label: 'page.nav.incomeexpense',
        href: '/transactions/income-expense'
      },
      {
        icon: mdiSwapHorizontal,
        label: 'page.nav.transfers',
        href: '/transactions/transfers'
      }
    ]
  },
  {
    type: 'section',
    icon: mdiScaleBalance,
    label: 'page.nav.automation',
    links: [
      {
        href: '/automation/schedule/transactions',
        label: 'page.nav.budget.recurring',
        icon: mdiCalendarArrowRight
      },
      {
        href: '/automation/schedule/rules',
        label: 'page.nav.settings.rules',
        icon: mdiShuffleVariant
      }
    ]
  },
  {
    type: 'divider',
    label: 'page.nav.settings'
  },
  {
    type: 'section',
    icon: mdiBadgeAccountHorizontalOutline,
    label: 'page.nav.accounts',
    links: [
      {
        href: '/accounts/own',
        label: 'page.nav.accounts.accounts',
        icon: mdiWallet
      },
      {
        href: '/accounts/expense?page=1',
        label: 'page.nav.accounts.creditor',
        icon: mdiCartOutline
      },
      {
        href: '/accounts/revenue?page=1',
        label: 'page.nav.accounts.debtor',
        icon: mdiCashMultiple
      },
      {
        href: '/accounts/liability',
        label: 'page.nav.accounts.liability',
        icon: mdiHandCoinOutline
      }
    ]
  },
  {
    type: 'section',
    icon: mdiTune,
    label: 'page.nav.settings.options',
    links: [
      {
        href: '/settings',
        label: 'page.header.application.settings',
        icon: mdiCogs
      },
      {
        href: '/settings/currencies',
        label: 'page.nav.settings.currencies',
        icon: mdiCurrencyUsd
      }
    ]
  },
  {
    type: 'button',
    href: '/categories',
    icon: mdiChartBar,
    label: 'page.nav.settings.categories'
  },
  // {
  //   type: 'button',
  //   href: '/import',
  //   icon: mdiFileUploadOutline,
  //   label: 'page.nav.settings.import'
  // }
];

export default config;
