import { Budget } from "../../core/types";
import Translation from "../localization/translation.component";
import ExpenseOverviewRowComponent from "./expense-overview-row.component";

const ExpenseOverviewComponent = ({ budget, year, month, onChanges } : { budget : Budget, year: number, month: number, onChanges: () => void }) => {
    return <>
        <table className='Table mt-5'>
            <thead>
            <tr>
                <th><Translation label='Budget.Expense.name' /></th>
                <th><Translation label='page.budget.group.expense.budgeted' /></th>
                <th className='hidden md:table-cell'><Translation label='page.budget.group.expense.spent' /></th>
                <th><Translation label='page.budget.group.expense.left' /></th>
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