import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRangeService from "../../../service/date-range.service";
import MoneyComponent from "../../format/money.component";

type CategorizedMonthlySpendingComponentProps = {
  currency: string,
  year: number
}

type CategoryMonthExpenses = {
  name: string,
  expenses: number[]
}

const CategorizedMonthlySpendingComponent = ({ currency, year }: CategorizedMonthlySpendingComponentProps) => {
  const [expenses, setExpenses] = useState<CategoryMonthExpenses[]>()

  useEffect(() => {
    const dataPromises = [...new Array(12).keys()]
      .map(month => DateRangeService.forMonth(year, month + 1))
      .map(async month => {
        const splitOnMonth = await StatisticalRepository.split('category', {
          dateRange: month.toBackend(),
          onlyIncome: false,
        })

        return {
          month: month.month(),
          expenses: splitOnMonth
        }
      })

    Promise.all(dataPromises)
      .then(monthSplits => {
        const monthExpenses: CategoryMonthExpenses[] = []

        monthSplits.forEach(({ month, expenses }) => {
          expenses.forEach(expense => {
            if (!expense.partition) return
            let category: CategoryMonthExpenses | undefined = monthExpenses.find(b => b.name === expense.partition)
            if (!category) {
              category = { name: expense.partition, expenses: [] }
              monthExpenses.push(category)
            }

            category.expenses[month - 1] = expense.balance
          })
        })

        setExpenses(monthExpenses)
      })
  }, [year]);


  return <>
    <DataTable value={ expenses } loading={ !expenses } size='small'>
      <Column header={ i10n('Category.label') } field='name' bodyClassName='font-bold' frozen={ true } alignFrozen='left' />
      { [...new Array(12).keys()].map(month =>
        <Column key={ month }
                headerClassName='min-w-[7rem]'
                body={ (row) => <MoneyComponent money={ row.expenses[month] } currency={ currency } /> }
                header={ i10n(`common.month.${ month + 1 }`) }/>)}
    </DataTable>
  </>
}

export default CategorizedMonthlySpendingComponent
