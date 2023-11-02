/**
 * The variants of actions that are available for styling
 */
export type StyleVariant = 'primary' | 'secondary' | 'warning' | 'info' | 'success'

export type Identifier = string | undefined

export type Identifiable = {
    id: Identifier
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
    description: string,
    iconFileCode: Identifier
}

export type Category = Identifiable & {
    enabled: boolean,
    code: string,
    symbol: string,
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
        tags?: string[]
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

export type SavingGoal = {
    name: string,
    goal: number,
    targetDate: string
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
    expenses: BudgetExpense[]
}

export type Pagination = {
    records: number,
    pageSize: number,
}

export type ChartSeries = {
    label: string,
    data: number[] | {x: string, y: number}[],
    cubicInterpolationMode?: string,
    tension?: number,
    borderColor?: string,
}