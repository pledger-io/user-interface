
/**
 * The variants of actions that are available for styling
 */
export type StyleVariant = 'primary' | 'secondary' | 'warning' | 'info' | 'success'

type Identifier = string | undefined

export type AccountRef = {
    id: Identifier,
    name: string,
    type: string | undefined
}

export type Contract = {
    id: Identifier,
    name: string,
    description?: string,
    company: AccountRef,
    start: string,
    end: string,
    fileToken?: string,

    terminated: boolean,
    scheduled: boolean,
    contractAvailable: boolean
}