import { Budget, BudgetExpense } from "../../core/types";
import { useEffect, useState } from "react";
import { Formats, Layout, Translations } from "../../core";
import BudgetRepository from "../../core/repositories/budget.repository";

type ComputedExpense = {
    expense: BudgetExpense,
    computed: {
        spent: number
        left: number
        dailySpent: number
        dailyLeft: number
    }
}

const ExpenseOverviewComponent = ({ budget, year, month } : {budget : Budget, year: number, month: number}) => {
    const [computedExpenses, setComputedExpenses] = useState<ComputedExpense[]>()

    useEffect(() => {
        Promise.all(
            budget.expenses
                .map(expense =>
                    new Promise<ComputedExpense>((accept, fail) =>
                        BudgetRepository.compute(expense.id, year, month)
                            .then(response => accept({
                                expense,
                                computed: response[0]
                            }))
                            .catch(fail)
                    )))
            .then(setComputedExpenses)
    }, [budget, month, year]);

    if (!computedExpenses) return <Layout.Loading />
    return <>
        <table className='Table mt-5'>
            <thead>
            <tr>
                <th><Translations.Translation label='Budget.Expense.name' /></th>
                <th><Translations.Translation label='page.budget.group.expense.budgeted' /></th>
                <th><Translations.Translation label='page.budget.group.expense.spent' /></th>
                <th><Translations.Translation label='page.budget.group.expense.left' /></th>
            </tr>
            </thead>
            <tbody>
            { computedExpenses.map(e =>
                <tr key={ e.expense.id }>
                    <td> { e.expense.name } </td>
                    <td>
                        <Formats.Money money={ e.expense.expected } />
                    </td>
                    <td>
                        <div className='flex gap-2'>
                            <Formats.Money money={ e.computed.spent } />
                            <span>(<Formats.Money money={ e.computed.dailySpent } />)</span>
                        </div>
                    </td>
                    <td>
                        <div className='flex gap-2'>
                            <Formats.Money money={ e.computed.left } />
                            <span>(<Formats.Money money={ e.computed.dailyLeft } />)</span>
                        </div>
                    </td>
                </tr>
            ) }
            </tbody>
        </table>
    </>
}

export default ExpenseOverviewComponent