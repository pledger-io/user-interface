import { Dates, Formats, Layout, Translations } from "../../core";
import React, { useEffect, useState } from "react";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { Category } from "../../core/types";

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
            dateRange: Dates.Ranges.forYear(year).toBackend()
        }).then(data => {
            const transformed = Array(12).fill(0)
            data.forEach(d => transformed[new Date(d.date).getMonth()] = d.amount)
            setSpending(transformed)
        })
    }, [category, year]);

    const months = Dates.Ranges.months(year)
    return (
        <tr key={ category.id }>
            <td>{ category.label }</td>
            { spending && months.map(month =>
                <td key={ month.month() }>
                    <Formats.Money money={ spending[month.month()] }/>
                </td>) }
            { !spending && <td colSpan={ 12 } className='text-center'>
                <Layout.Loading/>
            </td> }
        </tr>
    )
}

const CategorizedMonthlySpendingComponent = ({ categories, year }: CategorizedMonthlySpendingComponentProps) => {
    const months = [...new Array(12).keys()]
        .map(month => Dates.Ranges.forMonth(year, month + 1))

    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Category.label'/></th>
                { months.map(month =>
                    <th key={month.month()}>
                        <Translations.Translation label={`common.month.${month.month()}`}/>
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
