import {Dates, Loading, Statistical, Translations} from "../../core";
import React from "react";

const MonthlySpendingComponent = ({categories, range}) => {

    if (!categories || !range) return <Loading />
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
            {[...new Array(12).keys()]
                .map(month => <tr key={month}>
                    <td><Translations.Translation label={`common.month.${month + 1}`} /></td>
                    <td><Statistical.Balance income={true}
                                             categories={categories}
                                             range={Dates.Ranges.forMonth(range.year(), month + 1)}/></td>
                    <td><Statistical.Balance income={false}
                                             categories={categories}
                                             range={Dates.Ranges.forMonth(range.year(), month + 1)}/></td>
                </tr>)}
            </tbody>
        </table>
    )
}

export default MonthlySpendingComponent
