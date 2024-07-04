import React, { useEffect, useState } from "react";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { Category } from "../../../core/types";
import DateRangeService from "../../../service/date-range.service";
import MoneyComponent from "../../format/money.component";

import Loading from "../../layout/loading.component";
import Translation from "../../localization/translation.component";

type CategorizedMonthlySpendingComponentProps = {
    categories: Category[],
    year: number
}

const CategoryRowComponent = ({ category, year }: { category: Category, year: number }) => {
    const [spending, setSpending] = useState<number[]>();

    useEffect(() => {
        setSpending(undefined)
        StatisticalRepository.monthly({
            categories: [category],
            onlyIncome: false,
            dateRange: DateRangeService.forYear(year).toBackend()
        }).then(data => {
            const transformed = Array(12).fill(0)
            data.forEach(d => transformed[new Date(d.date).getMonth()] = d.amount)
            setSpending(transformed)
        })
    }, [category, year]);

    const months = DateRangeService.months(year)
    return (
        <tr key={ category.id }>
            <td>{ category.label }</td>
            { spending && months.map(month =>
                <td key={ month.month() }>
                    <MoneyComponent money={ spending[month.month()] }/>
                </td>) }
            { !spending && <td colSpan={ 12 } className='text-center'>
                <Loading/>
            </td> }
        </tr>
    )
}

const CategorizedMonthlySpendingComponent = ({ categories, year }: CategorizedMonthlySpendingComponentProps) => {
    const months = [...new Array(12).keys()]
        .map(month => DateRangeService.forMonth(year, month + 1))

    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translation label='Category.label'/></th>
                { months.map(month =>
                    <th key={month.month()}>
                        <Translation label={`common.month.${month.month()}`}/>
                    </th>)
                }
            </tr>
            </thead>
            <tbody>
            {categories.map(category => (
                <CategoryRowComponent key={ category.id } category={ category } year={ year }/>
            ))}
            </tbody>
        </table>
    )
}

export default CategorizedMonthlySpendingComponent
