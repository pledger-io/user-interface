import React, { useEffect, useState } from "react";
import { Progressbar } from "../../../core";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRange from "../../../types/date-range.type";
import { Budget } from "../../../types/types";

type YearlyBudgetIncomeComponentProps = {
  range: DateRange,
  budgets: Budget[]
}

const YearlyBudgetIncomeComponent = ({ range, budgets }: YearlyBudgetIncomeComponentProps) => {
  const [yearlyIncome, setYearlyIncome] = useState(0)
  const [yearlyExpected, setYearlyExpected] = useState(0)

  useEffect(() => {
    StatisticalRepository.balance({
        onlyIncome: true,
        dateRange: range.toBackend()
      }
    ).then(b => setYearlyIncome(b.balance))
      .catch(console.error)
  }, [range])
  useEffect(() => {
    setYearlyExpected(budgets.reduce((left, right) => left + right.income, 0))
  }, [budgets])

  return <Progressbar total={ yearlyExpected }
                 className='bg-green-800 h-12!'
                 current={ yearlyIncome }/>
}

export default YearlyBudgetIncomeComponent
