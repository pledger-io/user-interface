export type BudgetMonthPhase = "past" | "current" | "future"
export type BudgetRiskLevel = "low" | "medium" | "high"
export type BudgetRecommendationAction = "transactions" | "edit"

export type BudgetProjectionInput = {
  year: number
  month: number
  expected: number
  spent: number
  dailySpent: number
}

const getAbsoluteValue = (value?: number) => Math.abs(value || 0)

const monthIndex = (year: number, month: number) => year * 12 + month

const getCurrentMonthIndex = (now: Date) => monthIndex(now.getFullYear(), now.getMonth() + 1)

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate()

export const getBudgetMonthPhase = (year: number, month: number, now = new Date()): BudgetMonthPhase => {
  const selected = monthIndex(year, month)
  const current = getCurrentMonthIndex(now)
  if (selected < current) return "past"
  if (selected > current) return "future"
  return "current"
}

const getElapsedAndRemainingDays = (year: number, month: number, now = new Date()) => {
  const daysInMonth = getDaysInMonth(year, month)
  const elapsedDays = Math.min(now.getDate(), daysInMonth)
  const remainingDays = Math.max(daysInMonth - elapsedDays, 0)
  return { elapsedDays, remainingDays, daysInMonth }
}

export const getProjectedSpent = (input: BudgetProjectionInput, now = new Date()) => {
  const monthPhase = getBudgetMonthPhase(input.year, input.month, now)
  const spentToDate = getAbsoluteValue(input.spent)
  const expected = getAbsoluteValue(input.expected)

  if (monthPhase === "past") return spentToDate
  if (monthPhase === "future") return expected

  const { elapsedDays, remainingDays } = getElapsedAndRemainingDays(input.year, input.month, now)
  const explicitRunRate = getAbsoluteValue(input.dailySpent)
  const fallbackRunRate = elapsedDays > 0 ? spentToDate / elapsedDays : 0
  const runRate = explicitRunRate > 0 ? explicitRunRate : fallbackRunRate

  return spentToDate + runRate * remainingDays
}

export const getProjectedUsagePercentage = (projectedSpent: number, expected: number) => {
  const safeExpected = getAbsoluteValue(expected)
  const safeProjected = getAbsoluteValue(projectedSpent)

  if (safeExpected === 0) return safeProjected > 0 ? Number.POSITIVE_INFINITY : 0
  return safeProjected / safeExpected * 100
}

export const getBudgetRiskLevel = (input: {
  year: number
  month: number
  spent: number
  projectedSpent: number
  expected: number
}, now = new Date()): BudgetRiskLevel => {
  const monthPhase = getBudgetMonthPhase(input.year, input.month, now)
  if (monthPhase === "future") return "low"

  const usagePercentage = getProjectedUsagePercentage(input.projectedSpent, input.expected)
  const { remainingDays } = getElapsedAndRemainingDays(input.year, input.month, now)
  const alreadyFullySpentBeforeMonthEnd =
    monthPhase === "current" &&
    remainingDays > 0 &&
    getAbsoluteValue(input.expected) > 0 &&
    getAbsoluteValue(input.spent) >= getAbsoluteValue(input.expected)

  if (usagePercentage > 105 || alreadyFullySpentBeforeMonthEnd) return "high"
  if (usagePercentage > 90 && usagePercentage <= 105) return "medium"
  return "low"
}

export const getBudgetRecommendationTextKey = (riskLevel: BudgetRiskLevel) => `page.budget.overview.recommendation.${ riskLevel }`

export const getBudgetRecommendationActions = (
  riskLevel: BudgetRiskLevel,
  canEditBudget: boolean
): BudgetRecommendationAction[] => {
  if (riskLevel === "low") return ["transactions"]
  if (riskLevel === "medium") return canEditBudget ? ["transactions", "edit"] : ["transactions"]
  return canEditBudget ? ["edit", "transactions"] : ["transactions"]
}
