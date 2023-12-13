import { Range } from "../../core/Dates";
import { Budget } from "../../core/types";
import { useEffect, useState } from "react";
import BudgetRepository from "../../core/repositories/budget.repository";
import { Formats, Layout, Translations } from "../../core";
import ExpenseOverviewComponent from "./expense-overview.component";

const BudgetDetailComponent = ({ range }: {range: Range}) => {
    const [budget, setBudget] = useState<Budget>()

    useEffect(() => {
        BudgetRepository.budgetMonth(range.year(), range.month())
            .then(setBudget)
            .catch(console.error)
    }, [range]);

    if (!budget) return <Layout.Loading />
    return <>
        <div className='flex flex-col'>
            <div className='flex'>
                <Translations.Translation label='page.budget.group.budget.period'
                                          className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>
                <span>
                    <Translations.Translation label={`common.month.${range.month()}`} />
                    { range.year() }
                </span>
            </div>
            <div className='flex'>
                <Translations.Translation label='Budget.expectedIncome'
                                          className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>

                <Formats.Money money={ budget?.income } />
            </div>
            <div className='flex'>
                <Translations.Translation label='page.budget.group.expectedExpenses'
                                          className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>
                <Formats.Money money={ budget?.expenses
                    .map(expense => expense.expected)
                    .reduce((l, r) => l + r, 0)} />
            </div>
        </div>

        <ExpenseOverviewComponent budget={ budget }
                                  year={ range.year() }
                                  month={ range.month() }/>
    </>
}

export default BudgetDetailComponent