import React, {useEffect, useState} from "react";
import {Dates, Formats, Loading, Statistical, Translations} from "../../core";

const MonthlyTableBudgetComponent = ({budgets, year, currency}) => {
    const [months, setMonths]                   = useState([])
    const [monthlyExpenses, setMonthlyExpenses] = useState([])

    useEffect(() => {
        const ranges = [...new Array(12).keys()]
            .map(month => Dates.Ranges.forMonth(year, month + 1))

        Promise.all(ranges.map(month => Statistical.Service.balance({
            onlyIncome: false,
            dateRange: month
        })))
            .then(expenses => expenses.map(({balance}) => Math.abs(balance)))
            .then(setMonthlyExpenses)

        setMonths(ranges)
    }, [year])

    if (!budgets.length) return <Loading />
    return <>
        <table className='Table MonthlyView'>
            <thead>
            <tr>
                <th><Translations.Translation label='common.month'/></th>
                <th><Translations.Translation label='Transaction.budget'/></th>
                <th><Translations.Translation label='graph.series.budget.actual'/></th>
                <th><Translations.Translation label='common.difference'/></th>
                <th><Translations.Translation label='common.percentage'/></th>
            </tr>
            </thead>
            <tbody>
            { months.map((month, idx) => {
                const expectedExpenses = 0 + budgets[idx].expenses.reduce((total, e) => total + e.expected, 0)
                const percentageOfExpected = monthlyExpenses[idx] / expectedExpenses
                return <tr key={month.month()} className={percentageOfExpected > 1 ? 'warning' : 'success'}>
                    <td><Translations.Translation label={`common.month.${month.month()}`} /></td>
                    <td><Formats.Money money={expectedExpenses} currency={currency}/></td>
                    <td><Formats.Money money={monthlyExpenses[idx]} currency={currency}/></td>
                    <td><Formats.Money money={expectedExpenses - monthlyExpenses[idx]} currency={currency} /></td>
                    <td className={percentageOfExpected > 1 ? 'warning' : 'success'}><Formats.Percent percentage={percentageOfExpected} decimals={2} /></td>
                </tr>
            }) }
            </tbody>
        </table>
    </>
}

export default MonthlyTableBudgetComponent
