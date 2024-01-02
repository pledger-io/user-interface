import { Dates, Formats, Layout, Translations } from "../../core";
import React, { useEffect, useState } from "react";
import StatisticalRepository from "../../core/repositories/statistical-repository";

const CategorizedMonthlySpendingComponent = ({ categories, year }) => {
    const months = [...new Array(12).keys()]
        .map(month => Dates.Ranges.forMonth(year, month + 1))
    const [spending, setSpending] = useState({});

    useEffect(() => {
        setSpending({})
        categories.forEach(category => {
            StatisticalRepository.monthly({
                categories: [category],
                onlyIncome: false,
            }).then(data => {
                const transformed = Array(12).fill(0)
                data.forEach(d => transformed[new Date(d.date).getMonth()] = d.amount)
                setSpending(previous => ({
                    ...previous,
                    [category.id]: transformed
                }))
            })
        })
    }, [categories, year]);

    if (Object.keys(spending).length !== categories.length) return <Layout.Loading/>
    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Category.label'/></th>
                { months.map(month => <th key={month.month()}><Translations.Translation label={`common.month.${month.month()}`}/></th>) }
            </tr>
            </thead>
            <tbody>
            {categories.map(category => (
                <tr key={category.id}>
                    <td>{category.label}</td>
                    { months.map(month =>
                        <td key={ month.month() }>
                            <Formats.Money money={ spending[category.id][month.month()] }/>
                        </td>) }
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default CategorizedMonthlySpendingComponent
