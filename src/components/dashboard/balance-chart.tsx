import React, { useEffect, useState } from "react";

import { Chart } from "react-chartjs-2";
import { ChartData } from "chart.js";

import DateRange from "../../types/date-range.type";
import { BalanceSeries } from "../graphs/balance-series";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";
import Loading from "../layout/loading.component";
import { Panel } from "primereact/panel";
import { i10n } from "../../config/prime-locale";
import { useLocalStorage } from "primereact/hooks";
import { SupportedLocales } from "../../core/repositories/i18n-repository";

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

const BalanceChart = ({ range } : { range: DateRange }) => {
    const [balanceSeries, setBalanceSeries] = useState<ChartData | null>(null)
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

        BalanceSeries({
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true
        })
            .then(result => {
                if (!mounted) return
                setBalanceSeries({
                    datasets: [ result ]
                })
            })
            .catch(() => {
                if (!mounted) return
                setError(translate('page.dashboard.chart.balance.error', 'Unable to load balance chart.'))
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [range])

    return <Panel header={ i10n(`page.dashboard.accounts.balance`) }>
        { isLoading && <div className='relative h-[25em] flex flex-col justify-center rounded-md border border-separator bg-background/70'>
            <Loading/>
            <div className='mt-4 text-center text-sm text-muted'>{ translate('page.dashboard.chart.loading', 'Loading chart data...') }</div>
        </div> }

        { !isLoading && error && <div className='rounded-md border border-red-300 bg-red-50 px-3 py-4 text-sm'>
            { error }
        </div> }

        { !isLoading && !error && !hasChartData(balanceSeries) && <div className='rounded-md border border-separator bg-background px-3 py-4 text-sm'>
            { translate('page.dashboard.chart.balance.empty', 'No balance history available for this period.') }
        </div> }

        { !isLoading && !error && hasChartData(balanceSeries) && balanceSeries && <div className='relative h-[25em]'>
            <Chart type='line'
                   id='dashboard-balance-graph'
                   options={ ChartService.mergeOptions(
                       DefaultChartConfig.line,
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
                               tooltip: {
                                   callbacks: {
                                       title: (context: any) => {
                                           return context[0].dataset.label + ': ' + new Intl.DateTimeFormat(language)
                                               .format(context[0].parsed.x)
                                       },
                                       label: (context: any) => {
                                           const value = Number(context.parsed.y || 0)
                                           return currencyFormatter.format(value)
                                       }
                                   }
                               }
                           }
                       }
                   ) }
                   data={ balanceSeries }/></div>
        }
    </Panel>
}

export default BalanceChart