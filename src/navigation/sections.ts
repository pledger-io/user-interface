export type SectionId = 'overview' | 'transactions' | 'budgets' | 'accounts' | 'automation' | 'settings'

export type NavigationSection = {
  id: SectionId
  to: string
  icon: string
  labelKey: string
}

export type SectionDestination = {
  id: string
  section: SectionId
  to: string
  icon: string
  labelKey: string
  descriptionKey: string
  keywords: string[]
  aliases: string[]
  matchPrefixes: string[]
}

const sectionPrefixMappings: { section: SectionId, prefixes: string[] }[] = [
  { section: 'overview', prefixes: ['/dashboard', '/reports'] },
  { section: 'transactions', prefixes: ['/transactions', '/upload', '/categories'] },
  { section: 'budgets', prefixes: ['/budgets', '/contracts'] },
  { section: 'accounts', prefixes: ['/accounts'] },
  { section: 'automation', prefixes: ['/automation/schedule'] },
  { section: 'settings', prefixes: ['/settings', '/user/profile'] }
]

export const navigationSections: NavigationSection[] = [
  {
    id: 'overview',
    to: '/dashboard',
    icon: 'mdi:view-dashboard-outline',
    labelKey: 'page.nav.dashboard'
  },
  {
    id: 'transactions',
    to: '/transactions/income-expense',
    icon: 'mdi:swap-horizontal-bold',
    labelKey: 'page.nav.transactions'
  },
  {
    id: 'budgets',
    to: '/budgets',
    icon: 'mdi:wallet-outline',
    labelKey: 'page.nav.budget.groups'
  },
  {
    id: 'accounts',
    to: '/accounts/own',
    icon: 'mdi:badge-account-horizontal-outline',
    labelKey: 'page.nav.accounts'
  },
  {
    id: 'automation',
    to: '/automation/schedule/transactions',
    icon: 'mdi:robot-outline',
    labelKey: 'page.nav.automation'
  },
  {
    id: 'settings',
    to: '/settings/configure',
    icon: 'mdi:tune',
    labelKey: 'page.nav.settings'
  }
]

export const sectionDestinations: SectionDestination[] = [
  {
    id: 'overview.dashboard',
    section: 'overview',
    to: '/dashboard',
    icon: 'mdi:view-dashboard-outline',
    labelKey: 'page.nav.dashboard',
    descriptionKey: 'page.dashboard.description',
    keywords: ['overview', 'home'],
    aliases: ['dashboard'],
    matchPrefixes: ['/dashboard']
  },
  {
    id: 'overview.reports',
    section: 'overview',
    to: '/reports/income-expense',
    icon: 'mdi:home-analytics',
    labelKey: 'page.title.reports.default',
    descriptionKey: 'page.reports.default.title',
    keywords: ['reports', 'income', 'expense'],
    aliases: ['financial reports'],
    matchPrefixes: ['/reports/income-expense']
  },
  {
    id: 'overview.budgets-report',
    section: 'overview',
    to: '/reports/monthly-budget',
    icon: 'mdi:wallet-outline',
    labelKey: 'page.reports.budget.title',
    descriptionKey: 'page.reports.budget.title',
    keywords: ['budget', 'monthly', 'report'],
    aliases: ['monthly budget report'],
    matchPrefixes: ['/reports/monthly-budget']
  },
  {
    id: 'overview.categories-report',
    section: 'overview',
    to: '/reports/monthly-category',
    icon: 'mdi:chart-bar',
    labelKey: 'page.reports.category.title',
    descriptionKey: 'page.reports.category.title',
    keywords: ['category', 'monthly', 'report'],
    aliases: ['monthly category report'],
    matchPrefixes: ['/reports/monthly-category']
  },
  {
    id: 'overview.insights',
    section: 'overview',
    to: '/reports/spending-insight',
    icon: 'mdi:chart-areaspline',
    labelKey: 'page.reports.insights.title',
    descriptionKey: 'page.reports.insights.description',
    keywords: ['insights', 'spending', 'analysis'],
    aliases: ['spending insights'],
    matchPrefixes: ['/reports/spending-insight']
  },
  {
    id: 'transactions.income-expense',
    section: 'transactions',
    to: '/transactions/income-expense',
    icon: 'mdi:swap-horizontal-bold',
    labelKey: 'page.nav.incomeexpense',
    descriptionKey: 'page.transactions.description',
    keywords: ['transactions', 'income', 'expense'],
    aliases: ['income and expenses'],
    matchPrefixes: ['/transactions/income-expense']
  },
  {
    id: 'transactions.transfers',
    section: 'transactions',
    to: '/transactions/transfers',
    icon: 'mdi:swap-horizontal',
    labelKey: 'page.nav.transfers',
    descriptionKey: 'page.transactions.transfer.description',
    keywords: ['transfers', 'move', 'money'],
    aliases: ['transfer transactions'],
    matchPrefixes: ['/transactions/transfers']
  },
  {
    id: 'transactions.upload',
    section: 'transactions',
    to: '/upload/create',
    icon: 'mdi:file-upload-outline',
    labelKey: 'page.nav.settings.import',
    descriptionKey: 'page.settings.import.new',
    keywords: ['import', 'upload', 'transactions'],
    aliases: ['import transactions'],
    matchPrefixes: ['/upload']
  },
  {
    id: 'transactions.categories',
    section: 'transactions',
    to: '/categories',
    icon: 'mdi:shape-outline',
    labelKey: 'page.nav.settings.categories',
    descriptionKey: 'page.nav.settings.categories',
    keywords: ['categories', 'classification'],
    aliases: ['manage categories'],
    matchPrefixes: ['/categories']
  },
  {
    id: 'budgets.groups',
    section: 'budgets',
    to: '/budgets',
    icon: 'mdi:wallet-outline',
    labelKey: 'page.nav.budget.groups',
    descriptionKey: 'page.budget.description',
    keywords: ['budget', 'groups'],
    aliases: ['budget groups'],
    matchPrefixes: ['/budgets']
  },
  {
    id: 'budgets.contracts',
    section: 'budgets',
    to: '/contracts',
    icon: 'mdi:file-document-edit',
    labelKey: 'page.nav.budget.contracts',
    descriptionKey: 'page.contracts.description',
    keywords: ['contracts', 'recurring'],
    aliases: ['budget contracts'],
    matchPrefixes: ['/contracts']
  },
  {
    id: 'accounts.own',
    section: 'accounts',
    to: '/accounts/own',
    icon: 'mdi:account-outline',
    labelKey: 'page.nav.accounts.accounts',
    descriptionKey: 'page.accounts.description',
    keywords: ['accounts', 'own'],
    aliases: ['own accounts'],
    matchPrefixes: ['/accounts/own']
  },
  {
    id: 'accounts.expense',
    section: 'accounts',
    to: '/accounts/expense?page=1',
    icon: 'mdi:cart-outline',
    labelKey: 'page.nav.accounts.creditor',
    descriptionKey: 'page.accounts.description',
    keywords: ['expense', 'creditor', 'accounts'],
    aliases: ['expense accounts'],
    matchPrefixes: ['/accounts/expense']
  },
  {
    id: 'accounts.revenue',
    section: 'accounts',
    to: '/accounts/revenue?page=1',
    icon: 'mdi:cash-multiple',
    labelKey: 'page.nav.accounts.debtor',
    descriptionKey: 'page.accounts.description',
    keywords: ['revenue', 'debtor', 'accounts'],
    aliases: ['revenue accounts'],
    matchPrefixes: ['/accounts/revenue']
  },
  {
    id: 'accounts.liability',
    section: 'accounts',
    to: '/accounts/liability',
    icon: 'mdi:hand-coin-outline',
    labelKey: 'page.nav.accounts.liability',
    descriptionKey: 'page.accounts.description',
    keywords: ['liability', 'accounts'],
    aliases: ['liability accounts'],
    matchPrefixes: ['/accounts/liability']
  },
  {
    id: 'automation.transactions',
    section: 'automation',
    to: '/automation/schedule/transactions',
    icon: 'mdi:calendar-sync-outline',
    labelKey: 'page.nav.budget.recurring',
    descriptionKey: 'page.automation.description',
    keywords: ['automation', 'schedule', 'transactions'],
    aliases: ['scheduled transactions'],
    matchPrefixes: ['/automation/schedule/transactions']
  },
  {
    id: 'automation.rules',
    section: 'automation',
    to: '/automation/schedule/rules',
    icon: 'mdi:shuffle-variant',
    labelKey: 'page.nav.settings.rules',
    descriptionKey: 'page.automation.description',
    keywords: ['automation', 'rules'],
    aliases: ['automation rules'],
    matchPrefixes: ['/automation/schedule/rules']
  },
  {
    id: 'settings.configure',
    section: 'settings',
    to: '/settings/configure',
    icon: 'mdi:tune',
    labelKey: 'page.header.application.settings',
    descriptionKey: 'page.settings.description',
    keywords: ['settings', 'configure'],
    aliases: ['app settings'],
    matchPrefixes: ['/settings/configure']
  },
  {
    id: 'settings.currencies',
    section: 'settings',
    to: '/settings/currencies',
    icon: 'mdi:currency-eur',
    labelKey: 'page.nav.settings.currencies',
    descriptionKey: 'page.settings.description',
    keywords: ['currencies', 'settings'],
    aliases: ['manage currencies'],
    matchPrefixes: ['/settings/currencies']
  }
]

const startsWithAnyPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some(prefix => pathname.startsWith(prefix))

export const resolveActiveSection = (pathname: string): SectionId => {
  const match = sectionPrefixMappings.find(candidate => startsWithAnyPrefix(pathname, candidate.prefixes))
  return match?.section ?? 'overview'
}

export const sectionDestinationsFor = (section: SectionId) =>
  sectionDestinations.filter(destination => destination.section === section)
