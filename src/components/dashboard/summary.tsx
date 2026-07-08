import DateRange from "../../types/date-range.type";
import React, { useEffect, useMemo, useState } from "react";
import StatisticalRepository, { BalanceRequestFilter } from "../../core/repositories/statistical-repository";
import BudgetRepository from "../../core/repositories/budget.repository";
import { i10n } from "../../config/prime-locale";
import MoneyComponent from "../format/money.component";
import { Link } from "react-router";
import CategoryRepository from "../../core/repositories/category-repository";
import { Budget, Category } from "../../types/types";
import { Icon } from "@iconify-icon/react";
import { useLocalStorage } from "primereact/hooks";
import { SupportedLocales } from "../../core/repositories/i18n-repository";

type SummaryProps = {
    range: DateRange,
    compareRange: DateRange
}

type DashboardSummaryData = {
    currentBalance: number
    previousBalance: number
    expectedBudget: number
    actualBudget: number
    overspendingExpenseId?: string | number
    currentExpense: number
    previousExpense: number
    uncategorizedExpense: number
    unusualInsights: number
}

type AlertSeverity = 'ALERT' | 'WARNING' | 'INFO'

const missingLocalizationPrefix = '_missing_localization_'

const translate = (key: string, fallback: string) => {
    const translated = i10n(key)
    if (translated === key || translated.startsWith(missingLocalizationPrefix)) return fallback
    return translated
}

const toLocalDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = `${ date.getMonth() + 1 }`.padStart(2, '0')
    const day = `${ date.getDate() }`.padStart(2, '0')
    return `${ year }-${ month }-${ day }`
}

const parseDateStringAsLocalDate = (date: string) => {
    const [year, month, day] = date.split('-').map(part => parseInt(part, 10))
    return new Date(year, (month || 1) - 1, day || 1)
}

const monthlyRange = (date: Date) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return {
        startDate: toLocalDateString(monthStart),
        endDate: toLocalDateString(monthEnd)
    }
}

const severityClasses: Record<AlertSeverity, string> = {
    ALERT: 'border-l-4 border-l-red-600',
    WARNING: 'border-l-4 border-l-amber-500',
    INFO: 'border-l-4 border-l-blue-500'
}

const severitySignal: Record<AlertSeverity, string> = {
    ALERT: '[!]',
    WARNING: '[~]',
    INFO: '[i]'
}

const Summary = ({ range, compareRange }: SummaryProps) => {
    const rangeEnd = range.endString()
    const compareRangeEnd = compareRange.endString()
    const [language] = useLocalStorage<SupportedLocales>('en', 'language')
    const dashboardDate = useMemo(() => parseDateStringAsLocalDate(rangeEnd), [rangeEnd])
    const year = dashboardDate.getFullYear()
    const month = dashboardDate.getMonth() + 1
    const rangeBackend = useMemo(() => range.toBackend(), [range])
    const compareRangeBackend = useMemo(() => compareRange.toBackend(), [compareRange])
    const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                setError(null)
                setIsLoading(true)
                const [{ balance: currentBalance }, { balance: previousBalance }, { balance: currentExpenseRaw }, { balance: previousExpenseRaw }, budget, categories] = await Promise.all([
                    StatisticalRepository.balance({
                        range: { startDate: '1970-01-01', endDate: rangeEnd },
                        type: 'ALL'
                    } as BalanceRequestFilter),
                    StatisticalRepository.balance({
                        range: { startDate: '1970-01-01', endDate: compareRangeEnd },
                        type: 'ALL'
                    } as BalanceRequestFilter),
                    StatisticalRepository.balance({ range: rangeBackend, type: 'EXPENSE' }),
                    StatisticalRepository.balance({ range: compareRangeBackend, type: 'EXPENSE' }),
                    BudgetRepository.budgetMonth(year, month).catch((): Budget | null => null),
                    CategoryRepository.all().catch((): Category[] => [])
                ])

                const expenseIds = budget?.expenses
                    .map((expense) => expense.id)
                    .filter((expenseId): expenseId is string | number => expenseId !== undefined) || []

                const budgetRange = monthlyRange(dashboardDate)
                const budgetExpenseActuals = expenseIds.length > 0
                    ? await Promise.all(
                        (budget?.expenses || []).map(async (expense) => {
                            const result = await StatisticalRepository.balance({
                                range: budgetRange,
                                type: 'EXPENSE',
                                expenses: [expense.id]
                            })
                            return {
                                id: expense.id,
                                expected: expense.expected,
                                actual: Math.abs(result.balance)
                            }
                        })
                    )
                    : []

                const expectedBudget = budgetExpenseActuals.reduce((total, expense) => total + expense.expected, 0)
                const actualBudget = budgetExpenseActuals.reduce((total, expense) => total + expense.actual, 0)
                const currentExpense = Math.abs(currentExpenseRaw)
                const previousExpense = Math.abs(previousExpenseRaw)

                const categoryBalances = categories.length > 0
                    ? await Promise.all(categories
                        .map((category) => category.id)
                        .filter((categoryId): categoryId is string | number => categoryId !== undefined)
                        .map((categoryId) => StatisticalRepository.balance({
                            range: rangeBackend,
                            type: 'EXPENSE',
                            categories: [categoryId]
                        })))
                    : []

                const categorizedExpense = categoryBalances.reduce((total, item) => total + Math.abs(item.balance), 0)
                const uncategorizedExpense = Math.max(0, currentExpense - categorizedExpense)
                const unusualInsights = (await StatisticalRepository.insights(year, month).catch(() => []))
                    .filter((insight) => insight.severity === 'WARNING' || insight.severity === 'ALERT')
                    .length

                const overspendingExpense = budgetExpenseActuals
                    .filter((expense) => expense.actual > expense.expected)
                    .sort((first, second) => (second.actual - second.expected) - (first.actual - first.expected))[0]

                if (!mounted) return
                setSummaryData({
                    currentBalance,
                    previousBalance,
                    expectedBudget,
                    actualBudget,
                    overspendingExpenseId: overspendingExpense?.id,
                    currentExpense,
                    previousExpense,
                    uncategorizedExpense,
                    unusualInsights
                })
            } catch {
                if (!mounted) return
                setError(translate('page.dashboard.summary.error', 'Unable to load dashboard summary right now.'))
            } finally {
                if (mounted) setIsLoading(false)
            }
        }

        load()
        return () => {
            mounted = false
        }
    }, [compareRangeBackend, compareRangeEnd, dashboardDate, month, rangeBackend, rangeEnd, year])

    const spendingDelta = useMemo(() => {
        if (!summaryData) return { amount: 0, percentage: 0 }
        const amount = summaryData.currentExpense - summaryData.previousExpense
        if (summaryData.previousExpense === 0) return { amount, percentage: amount > 0 ? 100 : 0 }
        return { amount, percentage: (amount / summaryData.previousExpense) * 100 }
    }, [summaryData])

    const formatPercentage = (value: number) =>
        new Intl.NumberFormat(language, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100)

    const budgetSeverity: AlertSeverity = summaryData
        ? (summaryData.actualBudget > summaryData.expectedBudget ? 'ALERT' : summaryData.actualBudget >= summaryData.expectedBudget * 0.85 ? 'WARNING' : 'INFO')
        : 'INFO'
    const unusualSeverity: AlertSeverity = summaryData
        ? (summaryData.unusualInsights > 0 ? 'WARNING' : 'INFO')
        : 'INFO'
    const uncategorizedSeverity: AlertSeverity = summaryData
        ? (summaryData.uncategorizedExpense > 0 ? 'WARNING' : 'INFO')
        : 'INFO'

    const overspendingLink = summaryData?.overspendingExpenseId
        ? `/transactions/income-expense?budget=${ encodeURIComponent(summaryData.overspendingExpenseId.toString()) }`
        : `/budgets/${ year }/${ month }`

    const severityLabel = (severity: AlertSeverity) => {
        if (severity === 'ALERT') return translate('page.dashboard.severity.alert', 'Alert')
        if (severity === 'WARNING') return translate('page.dashboard.severity.warning', 'Warning')
        return translate('page.dashboard.severity.info', 'Info')
    }

    if (isLoading) {
        return <section className="grid gap-3 mt-4" aria-label="dashboard-summary-loading">
            <div className="grid gap-3 md:grid-cols-3">
                { [1, 2, 3].map((key) => <div key={ key } className="rounded-lg border border-separator bg-background p-4 animate-pulse min-h-32">
                    <div className="h-4 w-32 bg-slate-200 rounded mb-3"/>
                    <div className="h-8 w-40 bg-slate-200 rounded mb-2"/>
                    <div className="h-3 w-28 bg-slate-200 rounded"/>
                </div>) }
            </div>
            <div className="grid gap-3 md:grid-cols-3">
                { [1, 2, 3].map((key) => <div key={ key } className="rounded-lg border border-separator bg-background p-4 animate-pulse min-h-36">
                    <div className="h-4 w-24 bg-slate-200 rounded mb-3"/>
                    <div className="h-3 w-full bg-slate-200 rounded mb-2"/>
                    <div className="h-3 w-2/3 bg-slate-200 rounded"/>
                </div>) }
            </div>
        </section>
    }

    if (error) {
        return <section className="rounded-lg border border-red-300 bg-red-50 p-4 mt-4" aria-live="polite">
            <div className="font-semibold">{ translate('page.dashboard.summary.error.title', 'Summary unavailable') }</div>
            <div className="text-sm mt-1">{ error }</div>
        </section>
    }

    if (!summaryData) {
        return <section className="rounded-lg border border-separator bg-background p-4 mt-4">
            <div className="font-semibold">{ translate('page.dashboard.summary.empty.title', 'No dashboard data') }</div>
            <div className="text-sm mt-1">{ translate('page.dashboard.summary.empty.body', 'There is not enough data to build summary insights yet.') }</div>
        </section>
    }

    return <section className="grid gap-3 mt-4">
        <div className="grid gap-3 md:grid-cols-3 order-2 md:order-1">
            <article className="rounded-lg border border-separator bg-background p-4 min-h-32">
                <div className="text-sm text-muted">{ translate('page.dashboard.balance', 'Current balance') }</div>
                <div className="text-3xl mt-1">
                    <MoneyComponent money={ summaryData.currentBalance }/>
                </div>
                <div className="text-xs mt-2 text-muted">
                    { translate('page.dashboard.summary.trend.compare', 'Compared to previous range') }: <MoneyComponent money={ summaryData.currentBalance - summaryData.previousBalance }/>
                </div>
            </article>

            <article className="rounded-lg border border-separator bg-background p-4 min-h-32">
                <div className="text-sm text-muted">{ translate('page.dashboard.budget', 'Monthly budget status') }</div>
                <div className="text-xl mt-1 flex flex-wrap items-baseline gap-2">
                    <span><MoneyComponent money={ summaryData.actualBudget }/></span>
                    <span className="text-muted text-sm">/ <MoneyComponent money={ summaryData.expectedBudget }/></span>
                </div>
                <div className="text-xs mt-2 text-muted">
                    { summaryData.expectedBudget === 0
                        ? translate('page.dashboard.summary.budget.missing', 'No budget configured for this month.')
                        : translate('page.dashboard.summary.budget.progress', 'Actual versus expected spend for this month.') }
                </div>
            </article>

            <article className="rounded-lg border border-separator bg-background p-4 min-h-32">
                <div className="text-sm text-muted">{ translate('page.dashboard.expense', 'Spending change') }</div>
                <div className="text-3xl mt-1">
                    <MoneyComponent money={ spendingDelta.amount }/>
                </div>
                <div className="text-xs mt-2 text-muted">
                    { translate('page.dashboard.summary.expense.delta', 'Change from compare range') }: { formatPercentage(spendingDelta.percentage) }
                </div>
            </article>
        </div>

        <div className="grid gap-3 md:grid-cols-3 order-1 md:order-2">
            <article className={ `rounded-lg border border-separator bg-background p-4 min-h-36 ${ severityClasses[budgetSeverity] }` }>
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon icon='mdi:alert-octagon-outline' width='1.1em'/>
                    <span>{ severitySignal[budgetSeverity] } { severityLabel(budgetSeverity) }</span>
                </div>
                <div className="mt-2 font-medium">{ translate('page.dashboard.actions.overspending.title', 'Overspending risk') }</div>
                <div className="text-sm text-muted mt-1">
                    { budgetSeverity === 'ALERT'
                        ? translate('page.dashboard.actions.overspending.alert', 'Budget spend exceeded expected monthly amount.')
                        : translate('page.dashboard.actions.overspending.normal', 'Budget spend is currently within expected range.') }
                </div>
                <Link
                    to={ overspendingLink }
                    className="text-sm underline mt-3 inline-block"
                    aria-label={ translate('page.dashboard.actions.overspending.cta', 'Review overspending details') }>
                    { translate('page.dashboard.actions.overspending.cta', 'Review overspending details') }
                </Link>
            </article>

            <article className={ `rounded-lg border border-separator bg-background p-4 min-h-36 ${ severityClasses[unusualSeverity] }` }>
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon icon='mdi:chart-bell-curve-cumulative' width='1.1em'/>
                    <span>{ severitySignal[unusualSeverity] } { severityLabel(unusualSeverity) }</span>
                </div>
                <div className="mt-2 font-medium">{ translate('page.dashboard.actions.unusual.title', 'Unusual spending') }</div>
                <div className="text-sm text-muted mt-1">
                    { summaryData.unusualInsights > 0
                        ? `${ summaryData.unusualInsights } ${ translate('page.dashboard.actions.unusual.detected', 'insight(s) require review.') }`
                        : translate('page.dashboard.actions.unusual.none', 'No unusual spending insights detected.') }
                </div>
                <Link
                    to={ `/reports/spending-insight/${ year }/${ month }` }
                    className="text-sm underline mt-3 inline-block"
                    aria-label={ translate('page.dashboard.actions.unusual.cta', 'Review unusual spending insights') }>
                    { translate('page.dashboard.actions.unusual.cta', 'Review unusual spending insights') }
                </Link>
            </article>

            <article className={ `rounded-lg border border-separator bg-background p-4 min-h-36 ${ severityClasses[uncategorizedSeverity] }` }>
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon icon='mdi:tag-off-outline' width='1.1em'/>
                    <span>{ severitySignal[uncategorizedSeverity] } { severityLabel(uncategorizedSeverity) }</span>
                </div>
                <div className="mt-2 font-medium">{ translate('page.dashboard.actions.uncategorized.title', 'Uncategorized transactions') }</div>
                <div className="text-sm text-muted mt-1">
                    { summaryData.uncategorizedExpense > 0
                        ? <><MoneyComponent money={ summaryData.uncategorizedExpense }/> { translate('page.dashboard.actions.uncategorized.amount', 'spent without category assignment.') }</>
                        : translate('page.dashboard.actions.uncategorized.none', 'No uncategorized spending detected.') }
                </div>
                <Link
                    to={ `/transactions/income-expense/${ year }/${ month }?uncategorized=true` }
                    className="text-sm underline mt-3 inline-block"
                    aria-label={ translate('page.dashboard.actions.uncategorized.cta', 'Review uncategorized transactions') }>
                    { translate('page.dashboard.actions.uncategorized.cta', 'Review uncategorized transactions') }
                </Link>
            </article>
        </div>
    </section>
}

export default Summary