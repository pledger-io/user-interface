import SummaryComponent from "./summary-component";
import {mdiAbacus, mdiContactlessPaymentCircle, mdiScaleBalance, mdiSwapVerticalCircle} from "@mdi/js";
import {Statistical} from "../../core";
import React from "react";

const Summary = ({ range, compareRange }) => {
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

    return <>
        <div className="Columns Summary">
            <SummaryComponent
                title='page.dashboard.income'
                icon={mdiSwapVerticalCircle}
                currentPromise={
                    Statistical.Service.balance({...baseCommand, onlyIncome: true})
                        .then(({ balance }) => balance)
                }
                previousPromise={
                    Statistical.Service.balance({...compareBaseCommand, onlyIncome: true})
                        .then(({ balance }) => balance)
                }
                currency='EUR' />

            <SummaryComponent
                title='page.dashboard.expense'
                icon={mdiContactlessPaymentCircle}
                currentPromise={
                    Statistical.Service.balance({...baseCommand, onlyIncome: false})
                        .then(({ balance }) => Math.abs(balance))
                }
                previousPromise={
                    Statistical.Service.balance({...compareBaseCommand, onlyIncome: false})
                        .then(({ balance }) => Math.abs(balance))
                }
                currency='EUR' />

            <SummaryComponent
                title='page.dashboard.balance'
                icon={mdiScaleBalance}
                currentPromise={
                    Statistical.Service.balance({dateRange: {start: '1970-01-01', end: range.endString()}, allMoney: true})
                        .then(({ balance }) => balance)
                }
                previousPromise={
                    Statistical.Service.balance({dateRange: {start: '1970-01-01', end: compareRange.endString()}, allMoney: true})
                        .then(({ balance }) => balance)
                }
                currency='EUR' />

            <SummaryComponent
                title='page.dashboard.budget'
                currency='EUR'
                icon={mdiAbacus}/>
        </div>
    </>
}

export default Summary