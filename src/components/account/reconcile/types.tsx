import { ProcessStart } from "../../../core/repositories/process.repository";
import { Identifier } from "../../../types/types";

export type ReconcileStart = ProcessStart & {
    accountId: Identifier
    openBalance: number
    endBalance: number
    startDate: string
    endDate: string
}