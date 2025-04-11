import React from "react";
import { i10n } from "../../config/prime-locale";
import { ComputedExpense } from "../../core/repositories/budget.repository";
import { Budget } from "../../types/types";
import MoneyComponent from "../format/money.component";

export const BudgetSummary = ({ budget, computedExpenses }: { budget: Budget, computedExpenses: ComputedExpense[] }) => {
  const totalSpent = Math.abs(computedExpenses.reduce((l, r) => l + r.spent, 0))
  const totalBudget = budget.expenses.map(e => e.expected).reduce((l, r) => l + r, 0)
  return <>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div className='bg-green-50 p-4 rounded-lg'>
        <h3 className='text-green-800 font-semibold mb-2'>{ i10n('page.budget.group.expectedExpenses') }</h3>
        <p className='text-2xl font-bold text-green-600'>
          <MoneyComponent money={ totalBudget } className='!text-green-600'/>
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-blue-800 font-semibold mb-2">{ i10n('page.budget.group.expense.spent') }</h3>
        <p className="text-2xl font-bold text-blue-600">
          <MoneyComponent money={ totalSpent } className='!text-blue-600'/>
        </p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-purple-800 font-semibold mb-2">{ i10n('page.budget.group.expense.left') }</h3>
        <p className="text-2xl font-bold text-purple-600">
          <MoneyComponent money={ totalBudget - totalSpent } className='!text-purple-600'/>
        </p>
      </div>
    </div>
  </>
}
