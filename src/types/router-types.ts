import { Account, UserProfile } from "./types";

export type RouterAuthentication = {
  user: UserProfile
}
export type RouterAccountType = string | undefined
export type RouterAccount = Account | undefined

export const ROUTER_ACCOUNT_TYPE_KEY = 'other-accounts'
export const ROUTER_ACCOUNT_KEY = 'other-detail'
export const ROUTER_ACCOUNT_LIABILITY_KEY = 'liability'
export const ROUTER_TRANSACTION_SCHEDULE_KEY = 'edit-scheduled-transaction'
