import { ChartData } from "chart.js";
import React, { useEffect, useState } from "react";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRangeService from "../../../service/date-range.service";
import { i10n } from "../../../config/prime-locale";
import { Budget, BudgetExpense } from "../../../types/types";
import Loading from "../../layout/loading.component";
import BudgetChart from "./chart.component";

type BudgetYearlyExpenseProps = {
  year: number,
  budgets: Budget[],
  currencySymbol: string
}

const BudgetYearlyExpense = ({ year, budgets, currencySymbol }: BudgetYearlyExpenseProps) => {
  const [chartData, setChartData] = useState<ChartData | undefined>()

  useEffect(() => {
    if (budgets.length === 0) return
    setChartData(undefined)

    const uniqueExpenses = budgets.reduce((left, right) => [...left, ...right.expenses], new Array<BudgetExpense>())
      .map(({ id }) => id)
      .filter((value, index, self) => self.indexOf(value) === index)

    Promise.all(DateRangeService.months(year)
      .map(month => StatisticalRepository.balance({
        range: month.toBackend(),
        type: 'EXPENSE',
        expenses: uniqueExpenses
      })))
      .then(expenses => {
        setChartData({
          labels: DateRangeService.months(year).map(m => m.startDate()),
          datasets: [
            {
              label: i10n('graph.series.budget.expected'),
              data: budgets.map(({ expenses }) => expenses.reduce((total, { expected }) => total + expected, 0)),
              borderColor: '#f0c77c',
              backgroundColor: '#f0c77c'
            },
            {
              label: i10n('graph.series.budget.actual'),
              data: expenses.map(({ balance }) => Math.abs(balance)),
              borderColor: '#de7370',
              backgroundColor: '#de7370',
              type: "bar"
            }
          ]
        })
      })
      .catch(console.error)
  }, [year, budgets]);

  if (!chartData) return <Loading/>
  return <BudgetChart dataSet={ chartData } currencySymbol={ currencySymbol }/>
}

export default BudgetYearlyExpense
