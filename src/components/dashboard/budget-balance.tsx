import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import DateRange from "../../types/date-range.type";
import { ChartData } from "chart.js";
import { Budget, BudgetExpense } from "../../types/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import BudgetRepository from "../../core/repositories/budget.repository";
import RestAPI from "../../core/repositories/rest-api";
import Loading from "../layout/loading.component";
import { Panel } from "primereact/panel";
import { i10n } from "../../config/prime-locale";
import { useLocalStorage } from "primereact/hooks";
import { SupportedLocales } from "../../core/repositories/i18n-repository";

const percentageOfYear = 90 / 365
const missingLocalizationPrefix = '_missing_localization_'

const translate = (key: string, fallback: string) => {
    const translated = i10n(key)
    if (translated === key || translated.startsWith(missingLocalizationPrefix)) return fallback
    return translated
}

const hasChartData = (series?: ChartData | null) => {
    if (!series) return false
    if (!series.datasets || series.datasets.length === 0) return false
    const hasAnyPoint = series.datasets.some((dataset) => Array.isArray(dataset.data) && dataset.data.length > 0)
    return Boolean(hasAnyPoint)
}

function BudgetBalance({ range } : Readonly<{ range : DateRange }>) {
    const [budgetSeries, setBudgetSeries] = useState<ChartData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [language] = useLocalStorage<SupportedLocales>('en', 'language')
    const userCurrency = (RestAPI.user() as any).defaultCurrency?.code || 'EUR'
    const currencyFormatter = new Intl.NumberFormat(language, {
        style: 'currency',
        currency: userCurrency
    })

    useEffect(() => {
        let mounted = true

        BudgetRepository.budgetMonth(range.year(), range.month())
            .then(async (budget: Budget) => {
                const expenses = budget.expenses

                if (!mounted) return
                setBudgetSeries({
                    labels: expenses.map(({ name }) => name),
                    datasets: [
                        {
                            label: i10n('graph.series.budget.expected'),
                            data: expenses.map(expense => expense.expected * 12 * percentageOfYear),
                            backgroundColor: '#9abdd2'
                        },
                        {
                            label: i10n('graph.series.budget.actual'),
                            data: (await Promise.all(
                                expenses.map((expense : BudgetExpense) =>
                                    StatisticalRepository.balance({
                                        range: range.toBackend(),
                                        type: 'EXPENSE',
                                        expenses: [ expense.id ]
                                    })))).map(balance => Math.abs(balance.balance)),
                            backgroundColor: '#7fc6a5'
                        }
                    ]
                } as ChartData)
            })
            .catch(() => {
                if (!mounted) return
                setError(translate('page.dashboard.chart.budget.error', 'Unable to load budget chart.'))
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [range])

    const config = ChartService.mergeOptions(
        DefaultChartConfig.bar,
        {
            scales: {
                y: {
                    ticks: {
                        callback: (value: number) => {
                            return currencyFormatter.format(value)
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const label = context.dataset.label || ''
                            const value = Number(context.parsed.y || 0)
                            return `${label}: ${currencyFormatter.format(value)}`
                        }
                    }
                }
            }
        }
    )

    return <Panel header={ i10n('page.dashboard.budgets.balance') }>
        { isLoading && <div className='relative h-[18em] flex flex-col justify-center rounded-md border border-separator bg-background/70'>
            <Loading/>
            <div className='mt-4 text-center text-sm text-muted'>{ translate('page.dashboard.chart.loading', 'Loading chart data...') }</div>
        </div> }
        { !isLoading && error && <div className='rounded-md border border-red-300 bg-red-50 px-3 py-4 text-sm'>
            { error }
        </div> }
        { !isLoading && !error && !hasChartData(budgetSeries) && <div className='rounded-md border border-separator bg-background px-3 py-4 text-sm'>
            { translate('page.dashboard.chart.budget.empty', 'No budget expense data available for this period.') }
        </div> }
        { !isLoading && !error && hasChartData(budgetSeries) && budgetSeries &&
            <Chart type='bar'
                   id='dashboard-budgets-graph'
                   height={ 300 }
                   options={ config }
                   data={ budgetSeries }/>
        }
    </Panel>
}

export default BudgetBalance
