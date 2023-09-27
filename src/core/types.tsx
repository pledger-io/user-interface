
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
    },
    description: string
}

export type Contract = Identifiable & {
    name: string,
    description?: string,
    company: Account,
    start: string,
    end: string,
    fileToken?: string,

    terminated: boolean,
    scheduled: boolean,
    contractAvailable: boolean
}

export type SavingGoal = {
    name: string,
    goal: number,
    targetDate: string
}