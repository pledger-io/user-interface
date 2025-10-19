import React, { useEffect, useState } from "react";
import DateRange from "../types/date-range.type";
import StatisticalRepository, { BalanceRequestFilter } from "../core/repositories/statistical-repository";
import { Identifier } from "../types/types";
import MoneyComponent from "./format/money.component";
import Loading from "./layout/loading.component";

type Props = {
    accounts?: Identifier[]
    categories?: Identifier[]
    expenses?: Identifier[]
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
            type: income == undefined ? 'ALL' : income ? 'INCOME' : 'EXPENSE',
            expenses: expenses,
            currency: currency,
            categories: categories,
            importSlug: importSlug
        } as BalanceRequestFilter
        if (range) {
            filter.range = {
                startDate: range.startString(),
                endDate: range.endString()
            }
        }

        StatisticalRepository.balance(filter)
            .then(res => setBalance(res.balance))
    }, [accounts, income, currency, range, categories, expenses, importSlug])

    if (balance == null) return <Loading />
    return <span>
        <MoneyComponent money={ balance } currency={ currency } />
    </span>
}

export default _