import React, { useEffect, useState } from "react";
import { Progressbar } from "../../../core";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { Budget } from "../../../core/types";
import { Range } from "../../../core/Dates";

import Card from "../../layout/card.component";

type YearlyBudgetExpenseComponentProps = {
    budgets: Budget[],
    range: Range
}

const YearlyBudgetExpenseComponent = ({ budgets = [], range }: YearlyBudgetExpenseComponentProps) => {
    const [yearlyExpenses, setYearlyExpenses] = useState(0)
    const [yearlyExpected, setYearlyExpected] = useState(0)

    useEffect(() => {
        const expected = budgets.reduce(
            (total, b) => total + b.expenses.reduce(
                (subTotal, e) => subTotal + e.expected,
                0),
            0)
        setYearlyExpected(expected)
    }, [budgets])

    useEffect(() => {
        const allExpenses =
            [...new Set(budgets.flatMap(b => b.expenses.map(e => e.id)))]
            .map(id => {
                return {
                    id: id
                }
            })

        StatisticalRepository.balance({
            expenses: allExpenses,
            onlyIncome: false,
            dateRange: range.toBackend()
        }).then(({ balance }) => setYearlyExpenses(Math.abs(balance)))
            .catch(console.error)
    }, [budgets, range])

    return <>
        <Card title='page.reports.budget.expensePercent'>
            <Progressbar total={yearlyExpected}
                         className='warning !h-12'
                         current={yearlyExpenses}/>
        </Card>
    </>
}

export default YearlyBudgetExpenseComponent