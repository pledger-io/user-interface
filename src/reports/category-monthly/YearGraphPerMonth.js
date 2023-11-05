import React, {useEffect, useState} from "react";
import {Dates, Layout, Statistical, Translations} from "../../core";
import {Chart} from "../../core/Chart";

const CategoryGraph = ({categories, range, currencySymbol}) => {
    const [incomeSeries, setIncomeSeries]   = useState(undefined)
    const [expenseSeries, setExpenseSeries] = useState(undefined)
    const [monthLabels, setMonthLabels]     = useState([])
    const [currentRange, setCurrentRange]   = useState()

    useEffect(() => {
        if (!range || !categories) return
        if (currentRange === range.start) return

        const months = [...new Array(12).keys()]
            .map(x => x + 1)
            .map(month => Dates.Ranges.forMonth(range.year(), month))

        setCurrentRange(range.start)
        setMonthLabels(months.map(month => month.start))

        Promise.all(months.map(m => Statistical.Service.balance({
            dateRange: {
                start: m.startString(),
                end: m.endString()
            },
            onlyIncome: true,
            categories: categories})))
            .then(async responses => {
                return {
                    label: await Translations.LocalizationService.get('graph.series.income'),
                    backgroundColor: '#7fc6a5',
                    data: responses.map(({balance}) => balance)
                }
            })
            .then(setIncomeSeries)
            .catch(console.error)
        Promise.all(months.map(m => Statistical.Service.balance({
            dateRange: {
                start: m.startString(),
                end: m.endString()
            },
            onlyIncome: false,
            categories: categories})))
            .then(async responses => {
                return {
                    label: await Translations.LocalizationService.get('graph.series.expenses'),
                    backgroundColor: '#dc3545',
                    data: responses.map(({balance}) => balance)
                }
            })
            .then(setExpenseSeries)
            .catch(console.error)
    }, [categories, range, currentRange])

    if (!incomeSeries || !expenseSeries) return <Layout.Loading />
    return (
        <Chart height={450}
               id='category-monthly'
               type='bar'
               labels={monthLabels}
               dataSets={[incomeSeries, expenseSeries]}
               options={{
                   scales: {
                       x: {
                           type: 'time',
                           time: {
                               unit: 'month'
                           }
                       },
                       y: {
                           ticks: {
                               callback: value => `${currencySymbol}${value}`
                           }
                       }
                   }
               }}/>
    )
}

export default CategoryGraph
