import { DataView } from "primereact/dataview";
import { Divider } from "primereact/divider";
import { ProgressBar } from "primereact/progressbar";
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Link } from "react-router";
import { i10n } from "../../config/prime-locale";
import BudgetRepository, { ComputedExpense } from "../../core/repositories/budget.repository";
import DateRange from "../../types/date-range.type";
import { Budget, Identifier } from "../../types/types";
import DateComponent from "../format/date.component";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import { AddExpenseDialog } from "./add-expense-dialog";
import ExpenseActions from "./budget-expense-actions.component";
import { BudgetExpenseOverview, BudgetSummary } from "./budget-summary";
import {
  BudgetRiskLevel,
  getBudgetRecommendationActions,
  getBudgetRecommendationTextKey,
  getBudgetRiskLevel,
  getProjectedSpent,
  getProjectedUsagePercentage
} from "./budget-overview.utils";

const isCurrentMonth = (year: number, month: number) => {
  const now = new Date()
  return year === now.getFullYear() && month === now.getMonth() + 1
}

const isOpenBudgetPeriod = (period?: { endDate?: string, until?: string } | null) => !period?.endDate && !period?.until

type MappedExpense = ComputedExpense & {
  id: Identifier
}

type ExpenseProjection = BudgetExpenseOverview & {
  id: Identifier
  name: string
  projectedUsage: number
}

const fallbackComputedExpense: Omit<MappedExpense, "id"> = {
  spent: 0,
  left: 0,
  dailySpent: 0,
  dailyLeft: 0
}

const riskClassName: Record<BudgetRiskLevel, string> = {
  low: "border-green-200 bg-green-50 text-green-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-red-200 bg-red-50 text-red-700"
}

const progressColorByRisk: Record<BudgetRiskLevel, string> = {
  low: "#1b8d52",
  medium: "#b45309",
  high: "#b91c1c"
}

type BudgetLoadState = {
  status: "loading" | "ready" | "error" | "notFound"
  budget: Budget | null
  computedExpenses: MappedExpense[]
}

type BudgetLoadAction =
  | { type: "loading" }
  | { type: "ready", budget: Budget, computedExpenses: MappedExpense[] }
  | { type: "notFound" }
  | { type: "error" }

const budgetLoadReducer = (state: BudgetLoadState, action: BudgetLoadAction): BudgetLoadState => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        status: "loading"
      }
    case "ready":
      return {
        status: "ready",
        budget: action.budget,
        computedExpenses: action.computedExpenses
      }
    case "notFound":
      return {
        status: "notFound",
        budget: null,
        computedExpenses: []
      }
    case "error":
      return {
        status: "error",
        budget: null,
        computedExpenses: []
      }
  }
}

const BudgetDetailComponent = ({ range }: { range: DateRange }) => {
  const [loadState, dispatchLoadState] = useReducer(budgetLoadReducer, {
    status: "loading",
    budget: null,
    computedExpenses: []
  })
  const requestIdRef = useRef(0)

  const loadBudget = useCallback(() => {
    const requestId = ++requestIdRef.current
    dispatchLoadState({ type: "loading" })

    BudgetRepository.budgetMonth(range.year(), range.month())
      .then(async budget => {
        if (requestIdRef.current !== requestId) return
        const normalizedBudget = {
          ...budget,
          expenses: Array.isArray(budget.expenses) ? budget.expenses : []
        } as Budget
        const computed = await Promise.allSettled(normalizedBudget.expenses.map(async expense => {
          const balance = await BudgetRepository.compute(expense.id, range.year(), range.month())
          return {
            id: expense.id,
            ...(balance?.[0] || fallbackComputedExpense)
          } as MappedExpense
        }))
        if (requestIdRef.current !== requestId) return
        const computedExpenses = computed.map((result, index) => {
          if (result.status === "fulfilled") return result.value
          return { id: normalizedBudget.expenses[index].id, ...fallbackComputedExpense }
        })
        dispatchLoadState({
          type: "ready",
          budget: normalizedBudget,
          computedExpenses
        })
      })
      .catch((error: any) => {
        if (requestIdRef.current !== requestId) return
        if (error?.response?.status === 404 || error?.status === 404) {
          dispatchLoadState({ type: "notFound" })
          return
        }
        dispatchLoadState({ type: "error" })
      })
  }, [range])

  useEffect(() => {
    loadBudget()
  }, [loadBudget]);

  const computedById = useMemo(() => loadState.computedExpenses.reduce<Record<string, MappedExpense>>((accumulator, item) => {
    accumulator[item.id as any] = item
    return accumulator
  }, {}), [loadState.computedExpenses])

  const isLoading = loadState.status === "loading"
  const loadError = loadState.status === "error"
  const budgetNotFound = loadState.status === "notFound"
  const budget = loadState.budget

  if (isLoading) {
    return <div className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-8'>
      <Loading/>
      <div className='mt-4 text-center text-sm text-slate-600'>{ i10n('page.budget.overview.loading') }</div>
    </div>
  }

  if (loadError) {
    return <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-6'>
      <h3 className='font-semibold text-red-800'>{ i10n('page.budget.overview.error.title') }</h3>
      <p className='text-sm text-red-700 mt-1'>{ i10n('page.budget.overview.error.body') }</p>
      <button onClick={ loadBudget }
              className='mt-4 rounded-md border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100'>
        { i10n('page.budget.overview.action.retry') }
      </button>
    </div>
  }

  if (budgetNotFound) {
    return <div className='rounded-lg border border-amber-200 bg-amber-50 px-4 py-6'>
      <h3 className='font-semibold text-amber-800'>{ i10n('page.budget.overview.notfound.title') }</h3>
      <p className='text-sm text-amber-700 mt-1'>{ i10n('page.budget.overview.notfound.body') }</p>
      <button onClick={ loadBudget }
              className='mt-4 rounded-md border border-amber-300 bg-white px-3 py-1 text-sm font-medium text-amber-700 hover:bg-amber-100'>
        { i10n('page.budget.overview.action.retry') }
      </button>
    </div>
  }

  if (!budget) return null

  const canEditBudget = isCurrentMonth(range.year(), range.month()) && isOpenBudgetPeriod((budget as any).period)

  const expenseOverview: ExpenseProjection[] = budget.expenses.map(expense => {
    const computed = computedById[expense.id as any] || { id: expense.id, ...fallbackComputedExpense }
    const projectedSpent = getProjectedSpent({
      year: range.year(),
      month: range.month(),
      expected: expense.expected,
      spent: computed.spent,
      dailySpent: computed.dailySpent
    })
    const riskLevel = getBudgetRiskLevel({
      year: range.year(),
      month: range.month(),
      spent: computed.spent,
      projectedSpent,
      expected: expense.expected
    })

    return {
      id: expense.id,
      name: expense.name,
      expected: expense.expected,
      spent: computed.spent,
      projectedSpent,
      projectedUsage: getProjectedUsagePercentage(projectedSpent, expense.expected),
      riskLevel
    }
  })

  return <>
    <BudgetSummary budget={ budget } expenseOverview={ expenseOverview }/>

    <Divider className='my-4!'/>

    <div className='flex justify-end mb-4'>
      { canEditBudget && <AddExpenseDialog onChange={ loadBudget }/> }
    </div>

    { expenseOverview.length === 0 && <div className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-6'>
      <h3 className='font-semibold text-slate-900'>{ i10n('page.budget.overview.empty.title') }</h3>
      <p className='text-sm text-slate-600 mt-1'>{ i10n('page.budget.overview.empty.body') }</p>
    </div> }

    { expenseOverview.length > 0 && <DataView
      value={ expenseOverview }
      itemTemplate={ expense => budgetTemplate(
        budget.period.startDate,
        range.year(),
        range.month(),
        expense,
        loadBudget,
        canEditBudget
      ) }/> }
  </>
}

const budgetTemplate = (
  startDate: string,
  year: number,
  month: number,
  expense: ExpenseProjection,
  loadBudgets: () => void,
  canEditBudget: boolean
) => {
  const progressValue = Number.isFinite(expense.projectedUsage)
    ? Math.max(0, Math.min(expense.projectedUsage, 100))
    : 100
  const expenseId = expense.id?.toString()
  const recommendedActions = getBudgetRecommendationActions(expense.riskLevel, canEditBudget)
  const transactionLink = expenseId
    ? `/transactions/income-expense/${ year }/${ month }?budget=${ encodeURIComponent(expenseId) }`
    : null

  return <div className='my-3 rounded-lg border border-slate-200 bg-white p-4'>
    <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
      <div className='flex-1'>
        <strong className='text-slate-900'>{ expense.name }</strong>
        <div className='text-sm text-slate-500 mt-1'>
          { i10n('page.budget.group.expense.budgeted') }: <MoneyComponent money={ expense.expected } className='!text-slate-600'/>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1'>
        <Metric label={ i10n('page.budget.overview.category.planned') } value={ expense.expected }/>
        <Metric label={ i10n('page.budget.overview.category.actual') } value={ Math.abs(expense.spent) }/>
        <Metric label={ i10n('page.budget.overview.category.projected') } value={ expense.projectedSpent }/>
      </div>

      <div className='flex items-center justify-between lg:justify-end gap-3'>
        <span className={ `inline-flex rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${ riskClassName[expense.riskLevel] }` }>
          { i10n('page.budget.overview.category.risk') }: { i10n(`page.budget.overview.risk.${ expense.riskLevel }`) }
        </span>
      </div>
    </div>

    <div className='mt-4'>
      <ProgressBar className='h-4! rounded-lg! bg-gray-200! [&>.p-progressbar-value]:rounded-xl'
                 showValue={ false }
                 color={ progressColorByRisk[expense.riskLevel] }
                 value={ progressValue } />
      <div className='mt-2 text-sm text-slate-600'>
        { i10n('page.budget.overview.summary.forecast.usage') }: { Number.isFinite(expense.projectedUsage) ? expense.projectedUsage.toFixed(0) : "100+" }%
      </div>
      <div className='mt-2 text-sm text-slate-700'>
        { i10n(getBudgetRecommendationTextKey(expense.riskLevel)) }
      </div>
      <div className='mt-3 flex flex-wrap items-center gap-2'>
        { recommendedActions.map(action => {
          if (action === "edit") {
            return <ExpenseActions
              key={ `edit-${ expenseId }` }
              expense={ expense }
              callback={ loadBudgets }
              mode='button'
              buttonText={ expense.riskLevel !== "high" }
              buttonClassName={ expense.riskLevel === "high" ? "p-button-danger" : "p-button-secondary" }/>
          }

          if (!transactionLink) return null
          return <Link
            key={ `transactions-${ expenseId }` }
            to={ transactionLink }
            className={ `inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${ expense.riskLevel === "high" ? "border border-slate-300 text-slate-700 hover:bg-slate-50" : "text-blue-700 hover:text-blue-900 hover:underline" }` }>
            { i10n('page.budget.group.action.listTransactions') }
          </Link>
        }) }
      </div>
      <div className='text-sm text-slate-500 mt-1'>
        { i10n('page.budget.overview.category.since') }: <DateComponent date={ startDate }/>
      </div>
    </div>
  </div>
}

const Metric = ({ label, value }: { label: string, value: number }) => <div className='rounded-md border border-slate-100 bg-slate-50 px-3 py-2'>
  <div className='text-xs uppercase tracking-wide text-slate-500'>{ label }</div>
  <div className='mt-1 text-sm font-semibold text-slate-800'>
    <MoneyComponent money={ value } className='text-slate-800!'/>
  </div>
</div>

export default BudgetDetailComponent
