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
        range: range.toBackend(),
    }
    const compareBaseCommand = {
        range: range.toBackend()
    }

    return <div className="flex flex-wrap gap-2 mt-4">
        <div className="flex-1 flex-wrap flex gap-2">
            <SummaryComponent
                title='page.dashboard.income'
                icon={ mdiSwapVerticalCircle }
                currentPromise={
                    StatisticalRepository.balance({ ...baseCommand, type: 'INCOME' })
                        .then(({ balance }) => balance)
                }
                previousPromise={
                    StatisticalRepository.balance({ ...compareBaseCommand, type: 'INCOME' })
                        .then(({ balance }) => balance)
                }
                currency='EUR'/>

            <SummaryComponent
                title='page.dashboard.expense'
                icon={ mdiContactlessPaymentCircle }
                currentPromise={
                    StatisticalRepository.balance({ ...baseCommand, type: 'EXPENSE' })
                        .then(({ balance }) => Math.abs(balance))
                }
                previousPromise={
                    StatisticalRepository.balance({ ...compareBaseCommand, type: 'EXPENSE' })
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
                        range: { startDate: '1970-01-01', endDate: range.endString() },
                        type: 'ALL'
                    } as BalanceRequestFilter)
                        .then(({ balance }) => balance)
                }
                previousPromise={
                    StatisticalRepository.balance({
                        range: { startDate: '1970-01-01', endDate: compareRange.endString() },
                        type: 'ALL'
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