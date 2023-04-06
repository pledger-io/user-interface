import React, {useEffect, useState} from "react";
import {Dates, Formats, Statistical, Translations} from "../../core";

/**
 * A table with the expenses and expenses per month per expense line.
 *
 * @param {[]}      budgets
 * @param {int}     year            the year to display the data for
 * @param {string}  currency        the currency to fetch numbers for
 * @returns {JSX.Element}
 * @constructor
 */
const MonthlyPerBudgetTableComponent = ({budgets, year, currency}) => {
    const [months, setMonths]                   = useState([])
    const [expenses, setExpenses]               = useState([])

    useEffect(() => {
        const ranges = [...new Array(12).keys()]
            .map(month => Dates.Ranges.forMonth(year, month + 1))
        setMonths(ranges)
    }, [year])
    useEffect(() => {
        const reduced = budgets.reduce((expenses, budget) => [...expenses, ...budget.expenses], [])
        const unique = reduced.filter((e, i) => reduced.findIndex(a => a.id === e.id) === i)
        setExpenses(unique)
    }, [budgets])

    return <>
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Budget.Expense.name'/></th>
                {months.map(month => <th key={month.month()}><Translations.Translation label={`common.month.${month.month()}`}/></th>)}
            </tr>
            </thead>
            <tbody>
            {expenses.map(expense => <MonthlyBudgetTableRow key={expense.id} months={months} currency={currency} expense={expense} />)}
            </tbody>
        </table>
    </>
}

const MonthlyBudgetTableRow = ({months, expense, currency}) => {
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        Promise.all(months.map(month => Statistical.Service.balance({
            expenses: [expense],
            dateRange: month,
            onlyIncome: false,
            currency: currency
        })))
            .then(balances => balances.map(({balance}) => balance))
            .then(setExpenses)
    }, [expense, months, currency])

    return <tr key={expense.id}>
        <td>{expense.name}</td>
        {months.map((_, idx) => <td key={idx}><Formats.Money money={expenses[idx]} currency={currency}/></td>)}
    </tr>
}

export default MonthlyPerBudgetTableComponent
