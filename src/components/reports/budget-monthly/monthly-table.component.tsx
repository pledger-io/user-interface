import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRangeService from "../../../service/date-range.service";
import { Budget } from "../../../types/types";
import MoneyComponent from "../../format/money.component";

type MonthlyPerBudgetTableProps = {
  budgets: Budget[],
  year: number,
  currency: string
}

type BudgetMonthExpenses = {
  name: string,
  expenses: number[]
}

const MonthlyPerBudgetTableComponent = ({ budgets, year, currency }: MonthlyPerBudgetTableProps) => {
  const [expenses, setExpenses] = useState<BudgetMonthExpenses[]>([])

  useEffect(() => {
    if (budgets.length === 0) return

    const dataPromises = DateRangeService.months(year).map(async month => {
      const splitOnMonth = await StatisticalRepository.split('budget', {
        dateRange: month.toBackend(),
        onlyIncome: false,
        currency: currency
      })

      return {
        month: month.month(),
        expenses: splitOnMonth
      }
    })

    Promise.all(dataPromises)
      .then(monthSplits => {
        const budgetMonthExpenses: BudgetMonthExpenses[] = []

        monthSplits.forEach(({ month, expenses }) => {
          expenses.forEach(expense => {
            if (!expense.partition) return
            let budget: BudgetMonthExpenses | undefined = budgetMonthExpenses.find(b => b.name === expense.partition)
            if (!budget) {
              budget = { name: expense.partition, expenses: [] }
              budgetMonthExpenses.push(budget)
            }

            budget.expenses[month - 1] = expense.balance
          })
        })

        setExpenses(budgetMonthExpenses)
      })

  }, [year, budgets])

  return <>
    <DataTable value={ expenses } loading={ !expenses } size='small'>
      <Column header={ i10n('Budget.Expense.name') } field='name' />
      { [...new Array(12).keys()].map(month =>
        <Column key={ month }
                headerClassName='min-w-[7rem]'
                body={ (row: BudgetMonthExpenses) => <MoneyComponent money={ row.expenses[month] } currency={ currency } /> }
                header={ i10n(`common.month.${ month + 1 }`) }/>)}
    </DataTable>
  </>
}

export default MonthlyPerBudgetTableComponent
