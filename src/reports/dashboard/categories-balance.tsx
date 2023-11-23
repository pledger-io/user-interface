import {Layout, Translations} from "../../core";
import React, {useEffect, useState} from "react";
import CategoryRepository from "../../core/repositories/category-repository";
import {Loading} from "../../core/layout";
import {Range} from "../../core/Dates";
import {ChartData} from "chart.js";
import {Category} from "../../core/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import {Chart} from "react-chartjs-2";
import {DefaultChartConfig} from "../../config/global-chart-config";

const CategoriesBalance = ({ range } : {range: Range}) => {
    const [categorySeries, setCategorySeries] = useState<ChartData | undefined>()

    useEffect(() => {
        CategoryRepository.all()
            .then(async (categories : Category[]) => {
                setCategorySeries({
                    labels: categories.map(c => c.label),
                    datasets: [{
                        label: await Translations.LocalizationService.get('graph.series.category'),
                        backgroundColor: '#9abdd2',
                        data: (await Promise.all(
                            categories.map(c =>
                                StatisticalRepository.balance({
                                    dateRange: range.toBackend(),
                                    onlyIncome: false,
                                    categories: [{id: c.id}]
                                }))))
                            .map(b => b.balance)
                    }]
                })
            })
            .catch(_ => setCategorySeries({ labels: [], datasets: [] }))
    }, [range])

    return <>
        <Layout.Card title='page.dashboard.categories.balance'>
            { !categorySeries && <Loading /> }
            { categorySeries &&
                <Chart type='bar'
                       height={ 300 }
                       options={ DefaultChartConfig.bar }
                       data={ categorySeries }
                       id='dashboard-categories-graph' />
            }
        </Layout.Card>
    </>
}

export default CategoriesBalance