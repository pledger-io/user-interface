import DateRange from "../../types/date-range.type";
import SummaryComponent from "./summary-component";
import { mdiAbacus, mdiContactlessPaymentCircle, mdiScaleBalance, mdiSwapVerticalCircle } from "@mdi/js";
import React from "react";
import StatisticalRepository, { BalanceRequestFilter } from "../../core/repositories/statistical-repository";

type SummaryProps = {
    range: DateRange,
    compareRange: DateRange
}

const Summary = ({ range, compareRange }: SummaryProps) => {
    const baseCommand = {
        dateRange: {
            start: range.startString(),
            end: range.endString()
        }
    }
    const compareBaseCommand = {
        dateRange: {
            start: compareRange.startString(),
            end: compareRange.endString()
        }
    }

    return <div className="flex flex-wrap gap-2 mt-4">
        <div className="flex-1 flex-wrap flex gap-2">
            <SummaryComponent
                title='page.dashboard.income'
                icon={ mdiSwapVerticalCircle }
                currentPromise={
                    StatisticalRepository.balance({ ...baseCommand, onlyIncome: true })
                        .then(({ balance }) => balance)
                }
                previousPromise={
                    StatisticalRepository.balance({ ...compareBaseCommand, onlyIncome: true })
                        .then(({ balance }) => balance)
                }
                currency='EUR'/>

            <SummaryComponent
                title='page.dashboard.expense'
                icon={ mdiContactlessPaymentCircle }
                currentPromise={
                    StatisticalRepository.balance({ ...baseCommand, onlyIncome: false })
                        .then(({ balance }) => Math.abs(balance))
                }
                previousPromise={
                    StatisticalRepository.balance({ ...compareBaseCommand, onlyIncome: false })
                        .then(({ balance }) => Math.abs(balance))
                }
                currency='EUR'/>
        </div>

        <div className="flex-1 flex-wrap flex gap-2">
            <SummaryComponent
                title='page.dashboard.balance'
                icon={ mdiScaleBalance }
                currentPromise={
                    StatisticalRepository.balance({
                        dateRange: { start: '1970-01-01', end: range.endString() },
                        allMoney: true
                    } as BalanceRequestFilter)
                        .then(({ balance }) => balance)
                }
                previousPromise={
                    StatisticalRepository.balance({
                        dateRange: { start: '1970-01-01', end: compareRange.endString() },
                        allMoney: true
                    } as BalanceRequestFilter)
                        .then(({ balance }) => balance)
                }
                currency='EUR'/>

            <SummaryComponent
                title='page.dashboard.budget'
                currency='EUR'
                icon={ mdiAbacus }/>
        </div>
    </div>
}

export default Summary