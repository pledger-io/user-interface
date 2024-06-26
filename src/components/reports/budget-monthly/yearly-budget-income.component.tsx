import React, { useEffect, useState } from "react";
import { Progressbar, Statistical } from "../../../core";
import { Range } from "../../../core/Dates";
import { Budget } from "../../../core/types";

import Card from "../../layout/card.component";

type YearlyBudgetIncomeComponentProps = {
    range: Range,
    budgets: Budget[]
}

const YearlyBudgetIncomeComponent = ({ range, budgets = [] } : YearlyBudgetIncomeComponentProps) => {
    const [yearlyIncome, setYearlyIncome] = useState(0)
    const [yearlyExpected, setYearlyExpected] = useState(0)

    useEffect(() => {
        Statistical.Service.balance({
                onlyIncome: true,
                dateRange: range.toBackend()
            }
        ).then(b => setYearlyIncome(b.balance))
            .catch(console.error)
    }, [range])
    useEffect(() => {
        setYearlyExpected(budgets.reduce((left, right) => left + right.income, 0))
    }, [budgets])

    return <>
        <Card title='page.reports.budget.incomePercent'>
            <Progressbar total={yearlyExpected}
                         className='success !h-12'
                         current={yearlyIncome}/>
        </Card>
    </>
}

export default YearlyBudgetIncomeComponent