import React, { FC, useEffect, useState } from "react";
import { Dates, Formats, Statistical, Translations } from "../../core";
import { Budget, BudgetExpense } from "../../core/types";
import { Range } from "../../core/Dates";

type MonthlyPerBudgetTableProps = {
    budgets: Budget[],
    year: number,
    currency: string
}

const MonthlyPerBudgetTableComponent: FC<MonthlyPerBudgetTableProps> = ({ budgets, year, currency }) => {
    const [months, setMonths] = useState<Range[]>([])
    const [expenses, setExpenses] = useState<BudgetExpense[]>([])

    useEffect(() => {
        setMonths(Dates.Ranges.months(year))
    }, [year])
    useEffect(() => {
        const reduced = budgets.reduce((expenses: BudgetExpense[], budget) => [...expenses, ...budget.expenses], [])
        const unique = reduced.filter((e, i) => reduced.findIndex(a => a.id === e.id) === i)
        setExpenses(unique)
    }, [budgets])

    return <>
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Budget.Expense.name'/></th>
                { months.map(month =>
                    <th key={ month.month() }>
                        <Translations.Translation label={ `common.month.${ month.month() }` }/>
                    </th>) }
            </tr>
            </thead>
            <tbody>
            { expenses.map(expense =>
                <MonthlyBudgetTableRow key={ expense.id }
                                       months={ months }
                                       currency={ currency }
                                       expense={ expense } />) }
            { expenses.length === 0 && <tr><td className='text-center' colSpan={ 1 + months.length }><Translations.Translation label='common.overview.noresults' /></td></tr> }
            </tbody>
        </table>
    </>
}

type MonthlyBudgetTableRowProps = {
    months: Range[],
    expense: BudgetExpense,
    currency: string
}

const MonthlyBudgetTableRow: FC<MonthlyBudgetTableRowProps> = ({ months, expense, currency }) => {
    const [expenses, setExpenses] = useState<number[]>([])

    useEffect(() => {
        Promise.all(months.map(month => Statistical.Service.balance({
            expenses: [expense],
            dateRange: month.toBackend(),
            onlyIncome: false,
            currency: currency
        })))
            .then(balances => balances.map(({ balance }) => balance))
            .then(setExpenses)
    }, [expense, months, currency])

    return <tr key={expense.id}>
        <td>{expense.name}</td>
        {months.map((_, idx) => <td key={idx}><Formats.Money money={expenses[idx]} currency={currency}/></td>)}
    </tr>
}

export default MonthlyPerBudgetTableComponent
