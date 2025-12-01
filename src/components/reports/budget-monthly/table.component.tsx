import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { FC, useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import DateRange from "../../../types/date-range.type";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { Budget } from "../../../types/types";
import DateRangeService from "../../../service/date-range.service";
import MoneyComponent from "../../format/money.component";
import PercentageComponent from "../../format/percentage.component";

type BudgetTableProps = {
  budgets: Budget[],
  year: number,
  currency: string
}

type MonthlyBudgetTableRowProps = {
  month: number
  expected: number
  expenses: number
}

const BudgetTable: FC<BudgetTableProps> = ({ budgets, year, currency }) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyBudgetTableRowProps[]>()

  useEffect(() => {
    if (budgets.length === 0) return

    const ranges = DateRangeService.months(year)
    const promises = ranges.map(async (month: DateRange) => {
      const balance = await StatisticalRepository.balance({
        type: 'EXPENSE',
        range: month.toBackend()
      })

      return {
        month: month.month(),
        expected: budgets[month.month() - 1].expenses?.reduce((total, e) => total + e.expected, 0),
        expenses: Math.abs(balance.balance)
      }
    })

    Promise.all(promises)
      .then(setMonthlyExpenses)
      .catch(console.error)
  }, [year, budgets])

  return <>
    <DataTable value={ monthlyExpenses } loading={ !monthlyExpenses } size='small'>
      <Column header={ i10n('common.month') }
              body={ (row) => i10n(`common.month.${ row.month }`) }/>
      <Column header={ i10n('Transaction.budget') }
              body={ (row) => <MoneyComponent money={ row.expected } currency={ currency } /> }/>
      <Column header={ i10n('graph.series.budget.actual') }
              body={ (row) => <MoneyComponent money={ row.expenses } currency={ currency } /> }/>
      <Column header={ i10n('common.difference') }
              body={ (row) => <MoneyComponent money={ row.expected - row.expenses || 0 } currency={ currency } /> }/>
      <Column header={ i10n('common.percentage') }
              bodyClassName={ (row) => row.expected < row.expenses ? 'text-red-500' : 'text-green-600' }
              body={ (row) => <PercentageComponent percentage={ row.expenses / row.expected || 0 } decimals={ 2 }/> }/>
    </DataTable>
  </>
}

export default BudgetTable
