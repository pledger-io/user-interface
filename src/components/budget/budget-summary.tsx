import React from "react";
import { i10n } from "../../config/prime-locale";
import { Budget } from "../../types/types";
import MoneyComponent from "../format/money.component";
import { BudgetRiskLevel, getProjectedUsagePercentage } from "./budget-overview.utils";

export type BudgetExpenseOverview = {
  expected: number
  spent: number
  projectedSpent: number
  riskLevel: BudgetRiskLevel
}

const riskTextClass: Record<BudgetRiskLevel, string> = {
  low: "text-green-700",
  medium: "text-amber-700",
  high: "text-red-700"
}

const statusTextClass = (highestRisk: BudgetRiskLevel) => {
  if (highestRisk === "high") return "text-red-700"
  if (highestRisk === "medium") return "text-amber-700"
  return "text-green-700"
}

const statusTranslationKey = (highestRisk: BudgetRiskLevel) => {
  if (highestRisk === "high") return "page.budget.overview.status.over"
  if (highestRisk === "medium") return "page.budget.overview.status.watch"
  return "page.budget.overview.status.healthy"
}

const highestRiskLevel = (riskCount: Record<BudgetRiskLevel, number>): BudgetRiskLevel => {
  if (riskCount.high > 0) return "high"
  if (riskCount.medium > 0) return "medium"
  return "low"
}

export const BudgetSummary = ({ budget, expenseOverview }: { budget: Budget, expenseOverview: BudgetExpenseOverview[] }) => {
  const totalBudget = budget.expenses.map(e => e.expected).reduce((l, r) => l + r, 0)
  const totalSpent = Math.abs(expenseOverview.reduce((total, item) => total + item.spent, 0))
  const totalProjected = Math.abs(expenseOverview.reduce((total, item) => total + item.projectedSpent, 0))
  const projectedUsage = getProjectedUsagePercentage(totalProjected, totalBudget)

  const riskCount = expenseOverview.reduce<Record<BudgetRiskLevel, number>>((accumulator, item) => {
    accumulator[item.riskLevel] += 1
    return accumulator
  }, { low: 0, medium: 0, high: 0 })

  const riskItems: BudgetRiskLevel[] = ["high", "medium", "low"]
  const highestRisk = highestRiskLevel(riskCount)

  return <>
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
      <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
        <h3 className='text-slate-900 font-semibold mb-2'>{ i10n('page.budget.overview.summary.status') }</h3>
        <div className='text-sm text-slate-600 mb-2'>{ i10n('page.budget.overview.summary.status.description') }</div>
        <div className='flex justify-between text-sm text-slate-700'>
          <span>{ i10n('page.budget.overview.category.planned') }</span>
          <MoneyComponent money={ totalBudget } className='!text-slate-700 !text-base font-semibold'/>
        </div>
        <div className='flex justify-between text-sm text-slate-700 mt-1'>
          <span>{ i10n('page.budget.overview.category.actual') }</span>
          <MoneyComponent money={ totalSpent } className='!text-slate-700 !text-base font-semibold'/>
        </div>
        <div className={ `text-sm mt-3 font-semibold ${ statusTextClass(highestRisk) }` }>
          { i10n(statusTranslationKey(highestRisk)) }
        </div>
      </div>

      <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <h3 className='text-blue-900 font-semibold mb-2'>{ i10n('page.budget.overview.summary.forecast') }</h3>
        <div className='text-sm text-blue-700 mb-2'>{ i10n('page.budget.overview.summary.forecast.description') }</div>
        <div className='flex justify-between text-sm text-blue-800'>
          <span>{ i10n('page.budget.overview.category.projected') }</span>
          <MoneyComponent money={ totalProjected } className='!text-blue-800 !text-base font-semibold'/>
        </div>
        <div className='flex justify-between text-sm text-blue-800 mt-1'>
          <span>{ i10n('page.budget.group.expense.left') }</span>
          <MoneyComponent money={ totalBudget - totalProjected } className='!text-blue-800 !text-base font-semibold'/>
        </div>
        <div className='text-sm text-blue-900 mt-3 font-semibold'>
          { i10n('page.budget.overview.summary.forecast.usage') }: { Number.isFinite(projectedUsage) ? projectedUsage.toFixed(0) : "100+" }%
        </div>
      </div>

      <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
        <h3 className='text-red-900 font-semibold mb-2'>{ i10n('page.budget.overview.summary.risk') }</h3>
        <div className='text-sm text-red-700 mb-2'>{ i10n('page.budget.overview.summary.risk.description') }</div>
        { riskItems.map(risk => <div key={ risk } className='flex items-center justify-between text-sm mt-1'>
          <span className={ `font-medium ${ riskTextClass[risk] }` }>{ i10n(`page.budget.overview.risk.${ risk }`) }</span>
          <span className={ `font-semibold ${ riskTextClass[risk] }` }>{ riskCount[risk] }</span>
        </div>) }
      </div>
    </div>
  </>
}
