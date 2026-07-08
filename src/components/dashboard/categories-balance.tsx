import React, { useEffect, useState } from "react";
import CategoryRepository from "../../core/repositories/category-repository";
import DateRange from "../../types/date-range.type";
import { ChartData } from "chart.js";
import { Category } from "../../types/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { Chart } from "react-chartjs-2";
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

const CategoriesBalance = ({ range } : { range: DateRange }) => {
    const [categorySeries, setCategorySeries] = useState<ChartData | null>(null)
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

        CategoryRepository.all()
            .then(async (categories : Category[]) => {
                if (!mounted) return
                setCategorySeries({
                    labels: categories.map(c => c.name),
                    datasets: [{
                        label: i10n('graph.series.category'),
                        backgroundColor: '#9abdd2',
                        data: (await Promise.all(
                            categories.map(c =>
                                StatisticalRepository.balance({
                                    range: range.toBackend(),
                                    type: 'EXPENSE',
                                    categories: [ c.id ]
                                }))))
                            .map(({ balance }) => Math.abs(balance))
                    }]
                })
            })
            .catch(() => {
                if (!mounted) return
                setError(translate('page.dashboard.chart.category.error', 'Unable to load category chart.'))
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
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const value = Number(context.parsed.y || 0)
                            return currencyFormatter.format(value)
                        }
                    }
                }
            }
        }
    )

    return <Panel header={ i10n('page.dashboard.categories.balance') }>
        { isLoading && <div className='relative h-[18em] flex flex-col justify-center rounded-md border border-separator bg-background/70'>
            <Loading/>
            <div className='mt-4 text-center text-sm text-muted'>{ translate('page.dashboard.chart.loading', 'Loading chart data...') }</div>
        </div> }
        { !isLoading && error && <div className='rounded-md border border-red-300 bg-red-50 px-3 py-4 text-sm'>
            { error }
        </div> }
        { !isLoading && !error && !hasChartData(categorySeries) && <div className='rounded-md border border-separator bg-background px-3 py-4 text-sm'>
            { translate('page.dashboard.chart.category.empty', 'No categorized spending data available for this period.') }
        </div> }
        { !isLoading && !error && hasChartData(categorySeries) && categorySeries &&
            <Chart type='bar'
                   height={ 300 }
                   options={ config }
                   data={ categorySeries }
                   id='dashboard-categories-graph'/>
        }
    </Panel>
}

export default CategoriesBalance
