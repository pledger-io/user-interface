import { Formats, Translations } from "../../../core";
import React, { useEffect, useState } from "react";
import { Category } from "../../../core/types";
import { Range } from "../../../core/Dates";
import StatisticalRepository from "../../../core/repositories/statistical-repository";

import Loading from "../../layout/loading.component";

type MonthlySpendingComponentProps = {
    categories: Category[],
    range: Range
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
                <th><Translations.Translation label='common.month' /></th>
                <th><Translations.Translation label='page.reports.category.income' /></th>
                <th><Translations.Translation label='page.reports.category.expense' /></th>
            </tr>
            </thead>
            <tbody>
            { [...new Array(12).keys()]
                .map(month => <tr key={ month }>
                    <td><Translations.Translation label={ `common.month.${ month + 1 }` } /></td>
                    <td><Formats.Money money={ income[month] } /></td>
                    <td><Formats.Money money={ expense[month] } /></td>
                </tr>) }
            </tbody>
        </table>
    )
}

export default MonthlySpendingComponent
