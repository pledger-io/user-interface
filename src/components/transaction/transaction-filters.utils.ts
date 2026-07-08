import { TransactionFilter } from "./list-filters.component";

export type TransactionQuickPreset = "all" | "income" | "expenses" | "uncategorized"

export const MUTABLE_FILTER_KEYS: (keyof TransactionFilter)[] = [
  "account",
  "category",
  "budget",
  "uncategorized",
  "onlyIncome",
  "onlyExpenses",
  "description",
  "currency",
  "type"
]

export const QUICK_PRESETS: TransactionQuickPreset[] = ["all", "income", "expenses", "uncategorized"]
export const TRANSFER_QUICK_PRESETS: TransactionQuickPreset[] = ["all", "uncategorized"]

const isSet = (value: unknown) => {
  if (value === undefined || value === null) return false
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "boolean") return value
  return true
}

export const pickMutableFilters = (command: Record<string, any>) => {
  const filters: Record<string, any> = {}
  MUTABLE_FILTER_KEYS.forEach(key => {
    if (isSet(command[key])) {
      filters[key] = command[key]
    }
  })
  return filters
}

export const clearMutableFilters = (command: Record<string, any>) => {
  const result = { ...command }
  MUTABLE_FILTER_KEYS.forEach(key => {
    delete result[key]
  })
  return result
}

export const mergeMutableFilters = (command: Record<string, any>, update: Record<string, any>) => {
  const result = { ...command }
  Object.entries(update).forEach(([key, value]) => {
    if (!isSet(value)) {
      delete result[key]
      return
    }
    result[key] = value
  })
  return result
}

export const applyQuickPreset = (command: Record<string, any>, preset: TransactionQuickPreset, transfers: boolean) => {
  const base = clearMutableFilters(command)
  if (preset === "uncategorized") {
    return {
      ...base,
      uncategorized: true,
      type: transfers ? (command.type || "TRANSFER") : undefined,
      offset: 0
    }
  }

  if (transfers || preset === "all") {
    return {
      ...base,
      type: transfers ? (command.type || "TRANSFER") : undefined,
      offset: 0
    }
  }

  if (preset === "income") {
    return {
      ...base,
      onlyIncome: true,
      type: "INCOME",
      offset: 0
    }
  }

  return {
    ...base,
    onlyExpenses: true,
    type: "EXPENSE",
    offset: 0
  }
}

export const normalizeFilterState = (command: Record<string, any>, transfers: boolean) => {
  const next = { ...command }
  const onlyIncome = Boolean(next.onlyIncome)
  const onlyExpenses = Boolean(next.onlyExpenses)

  if (transfers) {
    delete next.onlyIncome
    delete next.onlyExpenses
    next.type = 'TRANSFER'
    return next
  }

  if (onlyIncome && onlyExpenses) {
    delete next.onlyIncome
    delete next.onlyExpenses
    delete next.type
    return next
  }

  if (onlyIncome) {
    next.onlyIncome = true
    delete next.onlyExpenses
    next.type = 'INCOME'
    return next
  }

  if (onlyExpenses) {
    next.onlyExpenses = true
    delete next.onlyIncome
    next.type = 'EXPENSE'
    return next
  }

  delete next.onlyIncome
  delete next.onlyExpenses
  if (next.type === 'INCOME' || next.type === 'EXPENSE') {
    delete next.type
  }

  return next
}

