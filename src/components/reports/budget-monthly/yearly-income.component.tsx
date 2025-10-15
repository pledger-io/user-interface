import { ChartData } from "chart.js";
import React, { useEffect, useState } from "react";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRangeService from "../../../service/date-range.service";
import { i10n } from "../../../config/prime-locale";
import { Budget } from "../../../types/types";
import Loading from "../../layout/loading.component";
import BudgetChart from "./chart.component";

type BudgetYearlyExpenseProps = {
  year: number,
  budgets: Budget[],
  currencySymbol: string
}

const YearlyIncomeGraphComponent = ({ year = 1970, budgets, currencySymbol = '' }: BudgetYearlyExpenseProps) => {
  const [chartData, setChartData] = useState<ChartData | undefined>()

  useEffect(() => {
    if (budgets.length === 0) return

    Promise.all(DateRangeService.months(year)
      .map(m => StatisticalRepository.balance({
        range: m.toBackend(),
        type: 'EXPENSE'
      })))
      .then(data => {
        setChartData({
          labels: DateRangeService.months(year).map(m => m.startDate()),
          datasets: [
            {
              label: i10n('graph.series.budget.expected'),
              data: budgets.map(({ income }) => income),
              borderColor: '#f0c77c',
              backgroundColor: '#f0c77c'
            },
            {
              data: data.map(({ balance }) => Math.abs(balance)),
              label: i10n('graph.series.budget.actual'),
              borderColor: '#6996b2',
              backgroundColor: '#6996b2',
              type: 'bar'
            }
          ]
        } as ChartData)
      })
      .catch(exception => {
        console.error('Failed to fetch budget data.', exception)
        setChartData({
          labels: DateRangeService.months(year).map(m => m.startDate()),
          datasets: []
        })
      })
  }, [year, budgets]);

  if (!chartData) return <Loading/>
  return <BudgetChart dataSet={ chartData } currencySymbol={ currencySymbol }/>
}

export default YearlyIncomeGraphComponent
