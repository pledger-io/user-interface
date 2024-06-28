import React, { useEffect, useState } from "react";

import StatisticalRepository from "./repositories/statistical-repository";
import { Money } from "./Formatters";

import Loading from "../components/layout/loading.component";

/**
 * The balance component can display a computed balance on a given search command. Where the search command can
 * be setup using the properties of the component.
 * @param [accounts] A list of accounts to filter on
 * @param [categories] A list of categories to filter on
 * @param [expenses] A list of expenses to filter on
 * @param {boolean} [income] Should income / expenses be displayed (or if absent both)
 * @param {string} [currency] The currency to fetch the balance in
 * @param [range] An optional date range for the balance
 * @param {string} [importSlug] An optional import slug to filter on
 */
const BalanceComponent = ({ accounts = [], categories = [], expenses = [],  income , currency, range, importSlug }) => {
    const [balance, setBalance] = useState(null)

    useEffect(() => {
        const filter = {
            accounts: accounts,
            allMoney: income == null,
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
            .then(balanceResponse => setBalance(balanceResponse.balance))
    }, [accounts, income, currency, range, categories, expenses, importSlug])

    if (balance == null) return <Loading />
    return <span className='Statistical-Balance'><Money money={balance} currency={currency} /></span>
}

export {
    StatisticalRepository as Service,
    BalanceComponent as Balance
}
