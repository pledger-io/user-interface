import React, { useEffect, useState } from "react";
import CategoryRepository from "../../core/repositories/category-repository";
import { Range } from "../../core/Dates";
import { ChartData } from "chart.js";
import { Category } from "../../core/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";

import LocalizationService from "../../service/localization.service";

import Card from "../layout/card.component";
import Loading from "../layout/loading.component";

const CategoriesBalance = ({ range } : { range: Range }) => {
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
            }
        }
    )

    return <Card title='page.dashboard.categories.balance'>
        { !categorySeries && <Loading/> }
        { categorySeries &&
            <Chart type='bar'
                   height={ 300 }
                   options={ config }
                   data={ categorySeries }
                   id='dashboard-categories-graph'/>
        }
    </Card>
}

export default CategoriesBalance