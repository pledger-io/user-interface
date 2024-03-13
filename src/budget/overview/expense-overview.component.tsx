import { Budget } from "../../core/types";
import { Translations } from "../../core";
import ExpenseOverviewRowComponent from "./expense-overview-row.component";

const ExpenseOverviewComponent = ({ budget, year, month, onChanges } : { budget : Budget, year: number, month: number, onChanges: () => void }) => {
    return <>
        <table className='Table mt-5'>
            <thead>
            <tr>
                <th><Translations.Translation label='Budget.Expense.name' /></th>
                <th><Translations.Translation label='page.budget.group.expense.budgeted' /></th>
                <th><Translations.Translation label='page.budget.group.expense.spent' /></th>
                <th><Translations.Translation label='page.budget.group.expense.left' /></th>
                <th className='w-7'/>
            </tr>
            </thead>
            <tbody>
            { budget.expenses.map(e =>
                <ExpenseOverviewRowComponent expense={ e } year={ year } month={ month } onChanges={ onChanges } />
            ) }
            </tbody>
        </table>
    </>
}

export default ExpenseOverviewComponent