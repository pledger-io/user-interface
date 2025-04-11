export type Identifier = string | number | undefined

export type Identifiable = {
  id: Identifier
}

export type Unique = {
  uuid: string
}

export type AccountRef = Identifiable & {
  name: string,
  type: string | undefined
}

export type Account = AccountRef & {
  account: {
    iban: string
    number: string,
    bic: string
    currency: string,
  },
  interest: {
    interest: number,
    periodicity: string
  },
  history: {
    firstTransaction: string,
    lastTransaction: string
  }
  type: any
  description: string,
  iconFileCode: string,
  savingGoals: SavingGoal[],
}

export type Category = Identifiable & {
  label: string,
  description: string
  lastUsed: string
}

export type Currency = Identifiable & {
  enabled: boolean,
  code: string,
  name: string,
  symbol: string,
  numberDecimals?: number
}

export type Contract = Identifiable & {
  name: string,
  description?: string,
  company: Account,
  start: string,
  end: string,
  fileToken?: string,

  terminated: boolean,
  notification: boolean,
  contractAvailable: boolean
}

export type Transaction = {
  id: Identifier,
  description: string,
  source: Account,
  destination: Account,
  metadata: {
    category?: string
    budget?: string,
    contract?: string,
    tags?: string[],
    failureCode?: string,
  }
  currency: string,
  amount: number,
  type: {
    code: 'DEBIT' | 'CREDIT' | 'TRANSFER'
  },
  dates: {
    transaction: string
  },
  split: []
}

export type ScheduledTransactionRange = {
  start: string,
  end: string,
}
export type ScheduledTransaction = {
  id: Identifier,
  name: string,
  description: string,
  amount: number,
  source: Account,
  destination: Account,
  range?: ScheduledTransactionRange,
  schedule: {
    periodicity: 'MONTHS' | 'YEARS' | 'WEEKS',
    interval: number
  }
}

export type SavingGoal = Identifiable & {
  name: string,
  goal: number,
  targetDate: string,
  reserved: number,
  monthsLeft: number,
}

export type Attachment = {
  fileCode: string,
}

export type BudgetExpense = {
  id: Identifier,
  name: string,
  expected: number,
}

export type Budget = {
  id: Identifier,
  name: string,
  income: number,
  expenses: BudgetExpense[],
  period: {
    from: string,
    until?: string
  }
}

export type PagedResponse<T> = {
  content: T[],
  info: Pagination
}

export type Pagination = {
  records: number,
  pageSize: number,
}

export type Balance = {
  balance: number
}

export type RuleGroup = {
  name: string
  sort: number
}

export type RuleField =
  'SOURCE_ACCOUNT'
  | 'TO_ACCOUNT'
  | 'DESCRIPTION'
  | 'AMOUNT'
  | 'CATEGORY'
  | 'CHANGE_TRANSFER_TO'
  | 'CHANGE_TRANSFER_FROM'
  | 'BUDGET'
  | 'CONTRACT'
  | 'TAGS'
export type RuleOperator = 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'MORE_THAN' | 'LESS_THAN'
export type RuleCondition = Identifiable & Unique & {
  field: RuleField
  operation: RuleOperator
  condition: string,
}
export type RuleChange = Identifiable & Unique & {
  field: RuleField
  change: string
}

export type Rule = Identifiable & {
  name: string
  restrictive: boolean
  description?: string
  active: boolean
  sort: number
  conditions: RuleCondition[]
  changes: RuleChange[]
}

export type BatchConfig = Identifiable & {
  name: string
  file: string
}

export type ImportJob = Identifiable & {
  slug: string,
  created: string,
  finished: string,
  balance: {
    income: number,
    expense: number
  },
  config: {
    name: string
  }
}

export type ApiError = {
  message: string
  _embedded: {
    errors: {
      field?: string
      message: string
    }[]
  },
  _links: {
    help?: {
      href: string
    }[]
  }
}

export type UserProfile = {
  theme: string,
  defaultCurrency?: Currency,
  currency: string
  mfa: boolean
}

export type DialogOptions = {
  open: () => void
}
