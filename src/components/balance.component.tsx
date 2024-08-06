import React, { useEffect, useState } from "react";
import DateRange from "../types/date-range.type";
import StatisticalRepository from "../core/repositories/statistical-repository";
import { Identifiable } from "../types/types";
import MoneyComponent from "./format/money.component";
import Loading from "./layout/loading.component";

type Props = {
    accounts?: Identifiable[]
    categories?: Identifiable[]
    expenses?: Identifiable[]
    income?: boolean
    currency?: string
    range?: DateRange
    importSlug?: string
}

const _ = ({ accounts = [], categories = [], expenses = [],  income , currency, range, importSlug }: Props) => {
    const [balance, setBalance] = useState<number | undefined>(undefined)

    useEffect(() => {
        const filter: any = {
            accounts: accounts,
            allMoney: income == undefined || !income,
            expenses: expenses,
            onlyIncome: income,
            currency: currency,
            categories: categories,
            importSlug: importSlug
        }
        if (range) {
            filter.dateRange = {
                start: range.startString(),
                end: range.endString()
            }
        }

        StatisticalRepository.balance(filter)
            .then(res => setBalance(res.balance))
    }, [accounts, income, currency, range, categories, expenses, importSlug])

    if (balance == null) return <Loading />
    return <span className='Statistical-Balance'><MoneyComponent money={balance} currency={currency} /></span>
}

export default _