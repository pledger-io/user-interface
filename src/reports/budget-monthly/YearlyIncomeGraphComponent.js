import React, {useEffect, useState} from "react";
import {Charts, Dates, Layout, Loading, Statistical, Translations} from "../../core";

/**
 * Creates ta graph with the income per month for the entire year.
 *
 * @param {int}     year        the year to fetch data for
 * @param {[]}      budgets     the budgets to use
 * @returns {JSX.Element}
 * @constructor
 */
const YearlyIncomeGraphComponent = ({year = 1970, budgets = []}) => {
    const [expectedDataset, setExpectedDataset] = useState()
    const [actualDataset, setActualDataset]     = useState()

    useEffect(() => {
        setExpectedDataset(undefined)
        Translations.LocalizationService.get('graph.series.budget.expected')
            .then(t => setExpectedDataset({
                label: t,
                data: budgets.map(({income}) => income),
                borderColor: '#f0c77c',
                backgroundColor: '#f0c77c'
            }))
    }, [budgets])
    useEffect(() => {
        setActualDataset(undefined)
        Promise.all(
            [...new Array(12).keys()]
                .map(m => Statistical.Service.balance({
                    dateRange: Dates.Ranges.forMonth(year, m + 1),
                    onlyIncome: true
                }))
        )
            .then(monthly => monthly.map(({balance}) => balance))
            .then(async data => setActualDataset({
                data: data,
                label: await Translations.LocalizationService.get('graph.series.budget.actual'),
                borderColor: '#6996b2',
                backgroundColor: '#6996b2'
            }))
    }, [year])

    const labels = [...new Array(12).keys()]
        .map(m => Dates.Ranges.forMonth(year, m + 1))
        .map(m => m.start)

    return <>
        <Layout.Card title='page.reports.budget.incomePercent'>
            {actualDataset && expectedDataset && <>
                <Charts.Chart id='budget-income'
                              type='line'
                              dataSets={[expectedDataset, actualDataset]}
                              labels={labels}
                              options={{
                                  scales: {
                                      x: {
                                          time: {
                                              unit: 'month'
                                          }
                                      }
                                  },
                                  plugins: {
                                      legend: {
                                          display: true
                                      }
                                  }
                              }}
                              height={300} />
            </>}
            {(!actualDataset || !expectedDataset) && <Loading />}
        </Layout.Card>
    </>
}

export default YearlyIncomeGraphComponent
