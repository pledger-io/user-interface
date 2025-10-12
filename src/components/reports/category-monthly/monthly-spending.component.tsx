import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRange from "../../../types/date-range.type";
import { Category } from "../../../types/types";
import MoneyComponent from "../../format/money.component";

type MonthlySpendingComponentProps = {
  categories: Category[],
  range: DateRange
}

type SpendingRow = {
  month: number,
  income: number,
  expense: number
}

const MonthlySpendingComponent = ({ categories, range }: MonthlySpendingComponentProps) => {
  const [spending, setSpending] = useState<SpendingRow[]>()

  useEffect(() => {
    if (!range) return

    const incomePromise = StatisticalRepository.monthly({
      categories: categories,
      onlyIncome: true,
      range: range.toBackend()
    })
    const expensePromise = StatisticalRepository.monthly({
      categories: categories,
      onlyIncome: false,
      range: range.toBackend()
    })

    Promise.all([incomePromise, expensePromise])
      .then(([income, expense]) => {
        const spendingRows: SpendingRow[] = [...new Array(12).keys()]
          .map(month => {
          return {
            month: month,
            income: income[month].amount,
            expense: expense[month].amount
          }
        })

        setSpending(spendingRows)
      })
  }, [categories, range]);

  return <>
    <DataTable value={ spending } loading={ !spending } size='small'>
      <Column header={ i10n('common.month') }
              body={ (row) => i10n(`common.month.${ row.month + 1 }`) }/>
      <Column header={ i10n('page.reports.category.income') }
              body={ (row) => <MoneyComponent money={ row.income }/> }/>
      <Column header={ i10n('page.reports.category.expense') }
              body={ (row) => <MoneyComponent money={ row.expense }/> }/>
    </DataTable>
  </>
}

export default MonthlySpendingComponent
