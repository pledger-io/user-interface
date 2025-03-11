import React, { useEffect, useState } from "react";
import CategoryRepository from "../../core/repositories/category-repository";
import DateRange from "../../types/date-range.type";
import { ChartData } from "chart.js";
import { Category } from "../../types/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";

import LocalizationService from "../../service/localization.service";
import Loading from "../layout/loading.component";
import { Panel } from "primereact/panel";
import { i10n } from "../../config/prime-locale";

const CategoriesBalance = ({ range } : { range: DateRange }) => {
    const [categorySeries, setCategorySeries] = useState<ChartData | undefined>()

    useEffect(() => {
        CategoryRepository.all()
            .then(async (categories : Category[]) => {
                setCategorySeries({
                    labels: categories.map(c => c.label),
                    datasets: [{
                        label: await LocalizationService.get('graph.series.category'),
                        backgroundColor: '#9abdd2',
                        data: (await Promise.all(
                            categories.map(c =>
                                StatisticalRepository.balance({
                                    dateRange: range.toBackend(),
                                    onlyIncome: false,
                                    categories: [{ id: c.id }]
                                }))))
                            .map(b => Math.abs(b.balance))
                    }]
                })
            })
            .catch(_ => setCategorySeries({ labels: [], datasets: [] }))
    }, [range])

    const config = ChartService.mergeOptions(
        DefaultChartConfig.bar,
        {
            scales: {
                y: {
                    ticks: {
                        callback: (value: number) => {
                            return `${(RestAPI.user() as any).defaultCurrency?.symbol}${value.toFixed(2)}`
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const value = context.parsed.y.toFixed(2)
                            return `${(RestAPI.user() as any).defaultCurrency?.symbol}${value}`
                        }
                    }
                }
            }
        }
    )

    return <Panel header={ i10n('page.dashboard.categories.balance') }>
        { !categorySeries && <Loading/> }
        { categorySeries &&
            <Chart type='bar'
                   height={ 300 }
                   options={ config }
                   data={ categorySeries }
                   id='dashboard-categories-graph'/>
        }
    </Panel>
}

export default CategoriesBalance