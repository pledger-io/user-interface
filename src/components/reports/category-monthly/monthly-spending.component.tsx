import React, { useEffect, useState } from "react";
import { Category } from "../../../types/types";
import DateRange from "../../../types/date-range.type";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import MoneyComponent from "../../format/money.component";

import Loading from "../../layout/loading.component";
import Translation from "../../localization/translation.component";

type MonthlySpendingComponentProps = {
    categories: Category[],
    range: DateRange
}

const MonthlySpendingComponent = ({ categories, range } : MonthlySpendingComponentProps) => {
    const [income, setIncome] = useState<number[]>()
    const [expense, setExpense] = useState<number[]>()

    useEffect(() => {
        if (!range) return

        setIncome(undefined)
        StatisticalRepository.monthly({
            categories: categories,
            onlyIncome: true,
            dateRange: range.toBackend()
        }).then(data => {
            const transformed = Array(12).fill(0)
            data.forEach(d => transformed[new Date(d.date).getMonth()] = d.amount)
            setIncome(transformed)
        })

        StatisticalRepository.monthly({
            categories: categories,
            onlyIncome: false,
            dateRange: range.toBackend()
        }).then(data => {
            const transformed = Array(12).fill(0)
            data.forEach(d => transformed[new Date(d.date).getMonth()] = d.amount)
            setExpense(transformed)
        })

    }, [categories, range]);

    if (!income || !expense) return <Loading />
    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translation label='common.month' /></th>
                <th><Translation label='page.reports.category.income' /></th>
                <th><Translation label='page.reports.category.expense' /></th>
            </tr>
            </thead>
            <tbody>
            { [...new Array(12).keys()]
                .map(month => <tr key={ month }>
                    <td><Translation label={ `common.month.${ month + 1 }` } /></td>
                    <td><MoneyComponent money={ income[month] } /></td>
                    <td><MoneyComponent money={ expense[month] } /></td>
                </tr>) }
            </tbody>
        </table>
    )
}

export default MonthlySpendingComponent
