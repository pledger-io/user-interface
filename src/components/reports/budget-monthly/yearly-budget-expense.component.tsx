import { Panel } from "primereact/panel";
import React, { useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import { Progressbar } from "../../../core";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRange from "../../../types/date-range.type";
import { Budget } from "../../../types/types";

type YearlyBudgetExpenseComponentProps = {
  budgets: Budget[],
  range: DateRange
}

const YearlyBudgetExpenseComponent = ({ budgets, range }: YearlyBudgetExpenseComponentProps) => {
  const [yearlyExpenses, setYearlyExpenses] = useState(0)
  const [yearlyExpected, setYearlyExpected] = useState(0)

  useEffect(() => {
    const expected = budgets.reduce(
      (total, b) => total + b.expenses.reduce(
        (subTotal, e) => subTotal + e.expected,
        0),
      0)
    setYearlyExpected(expected)
  }, [budgets])

  useEffect(() => {
    const allExpenses =
      [...new Set(budgets.flatMap(b => b.expenses.map(e => e.id)))]
        .map(id => {
          return {
            id: id
          }
        })

    StatisticalRepository.balance({
      expenses: allExpenses,
      onlyIncome: false,
      dateRange: range.toBackend()
    }).then(({ balance }) => setYearlyExpenses(Math.abs(balance)))
      .catch(console.error)
  }, [budgets, range])

  return <Progressbar total={ yearlyExpected }
                 className='bg-red-800 h-12!'
                 current={ yearlyExpenses }/>
}

export default YearlyBudgetExpenseComponent
