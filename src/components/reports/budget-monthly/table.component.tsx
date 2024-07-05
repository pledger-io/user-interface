import React, { FC, useEffect, useState } from "react";
import DateRange from "../../../types/date-range.type";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { Budget } from "../../../types/types";
import DateRangeService from "../../../service/date-range.service";
import MoneyComponent from "../../format/money.component";
import PercentageComponent from "../../format/percentage.component";

import Translation from "../../localization/translation.component";

type BudgetTableProps = {
    budgets: Budget[],
    year: number,
    currency: string
}

const BudgetTable: FC<BudgetTableProps> = ({ budgets, year, currency }) => {
    const [months, setMonths] = useState<DateRange[]>([])
    const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>([])

    useEffect(() => {
        const ranges = DateRangeService.months(year)

        Promise.all(ranges.map(month => StatisticalRepository.balance({
            onlyIncome: false,
            dateRange: month.toBackend()
        })))
            .then(expenses => expenses.map(({ balance }) => Math.abs(balance)))
            .then(setMonthlyExpenses)
            .catch(console.error)

        setMonths(ranges)
    }, [year])

    return <table className='Table MonthlyView'>
        <thead>
        <tr>
            <th><Translation label='common.month'/></th>
            <th><Translation label='Transaction.budget'/></th>
            <th><Translation label='graph.series.budget.actual'/></th>
            <th><Translation label='common.difference'/></th>
            <th><Translation label='common.percentage'/></th>
        </tr>
        </thead>
        <tbody>
        { budgets.length > 0 && months.map((month, idx) => {
            const expectedExpenses = budgets[idx].expenses.reduce((total, e) => total + e.expected, 0)
            const percentageOfExpected = monthlyExpenses[idx] / expectedExpenses
            return <tr key={ month.month() } className={ percentageOfExpected > 1 ? 'warning' : 'success' }>
                <td>
                    <Translation label={ `common.month.${ month.month() }` }/>
                </td>
                <td>
                    <MoneyComponent money={ expectedExpenses }
                                    currency={ currency }/>
                </td>
                <td>
                    <MoneyComponent money={ monthlyExpenses[idx] }
                                    currency={ currency }/>
                </td>
                <td>
                    <MoneyComponent money={ expectedExpenses - monthlyExpenses[idx] }
                                    currency={ currency }/>
                </td>
                <td className={ percentageOfExpected > 1 ? 'warning' : 'success' }>
                    <PercentageComponent percentage={ percentageOfExpected }
                                         decimals={ 2 }/>
                </td>
            </tr>
        }) }
        { budgets.length === 0 && <tr>
            <td className='text-center' colSpan={ 5 }><Translation label='common.overview.noresults'/></td>
        </tr> }
        </tbody>
    </table>
}

export default BudgetTable
