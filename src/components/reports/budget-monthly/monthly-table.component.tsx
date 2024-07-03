import React, { FC, useEffect, useState } from "react";
import { Dates } from "../../../core";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { Budget, BudgetExpense } from "../../../core/types";
import { Range } from "../../../core/Dates";
import MoneyComponent from "../../format/money.component";

import Loading from "../../layout/loading.component";
import Translation from "../../localization/translation.component";

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

    return <table className='Table'>
        <thead>
        <tr>
            <th><Translation label='Budget.Expense.name'/></th>
            { months.map(month =>
                <th key={ month.month() }>
                    <Translation label={ `common.month.${ month.month() }` }/>
                </th>) }
        </tr>
        </thead>
        <tbody>
        { expenses.map(expense =>
            <MonthlyBudgetTableRow key={ expense.id }
                                   months={ months }
                                   currency={ currency }
                                   expense={ expense }/>) }
        { expenses.length === 0 && <tr>
            <td className='text-center' colSpan={ 1 + months.length }><Translation label='common.overview.noresults'/>
            </td>
        </tr> }
        </tbody>
    </table>
}

type MonthlyBudgetTableRowProps = {
    months: Range[],
    expense: BudgetExpense,
    currency: string
}

const MonthlyBudgetTableRow: FC<MonthlyBudgetTableRowProps> = ({ months, expense, currency }) => {
    const [expenses, setExpenses] = useState<number[]>([])

    useEffect(() => {
        setExpenses([])
        Promise.all(months.map(month => StatisticalRepository.balance({
            expenses: [expense],
            dateRange: month.toBackend(),
            onlyIncome: false,
            currency: currency
        })))
            .then(balances => balances.map(({ balance }) => balance))
            .then(setExpenses)
    }, [expense, months, currency])

    return <tr key={ expense.id }>
        <td>{ expense.name }</td>
        { months.map((_, idx) =>
            <td key={ idx }>
                { expenses[idx] === undefined && <Loading/> }
                { expenses[idx] && <MoneyComponent money={expenses[idx]} currency={currency}/> }
            </td>) }
    </tr>
}

export default MonthlyPerBudgetTableComponent
