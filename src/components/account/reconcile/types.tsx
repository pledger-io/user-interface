export type ReconcileStart = ProcessStart & {
    openBalance: number
    endBalance: number
    startDate: string
    endDate: string
}