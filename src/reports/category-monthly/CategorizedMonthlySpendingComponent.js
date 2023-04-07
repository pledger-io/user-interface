import {Dates, Statistical, Translations} from "../../core";
import React from "react";

const CategorizedMonthlySpendingComponent = ({categories, year}) => {
    const months = [...new Array(12).keys()]
        .map(month => Dates.Ranges.forMonth(year, month + 1))

    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Category.label'/></th>
                {months.map(month => <th key={month.month()}><Translations.Translation label={`common.month.${month.month()}`}/></th>)}
            </tr>
            </thead>
            <tbody>
            {categories.map(category => (
                <tr key={category.id}>
                    <td>{category.label}</td>
                    {months.map(month => <td key={month.month()}>
                        <Statistical.Balance income={false} categories={[category]} range={month}/>
                    </td>)}
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default CategorizedMonthlySpendingComponent
