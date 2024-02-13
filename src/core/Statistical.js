import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import StatisticalRepository from "./repositories/statistical-repository";
import { Money } from "./Formatters";
import { EntityShapes } from "../config";
import { Loading } from "./layout";

/**
 * The balance component can display a computed balance on a given search command. Where the search command can
 * be setup using the properties of the component.
 */
const BalanceComponent = ({ accounts = [], categories = [], expenses = [],  income, currency, range, importSlug }) => {
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
    }, [accounts, income, currency, range, categories, expenses])

    if (balance == null) return <Loading />
    return <span className='Statistical-Balance'><Money money={balance} currency={currency} /></span>
}
BalanceComponent.propTypes = {
    // A list of accounts to filter on
    accounts: PropTypes.arrayOf(EntityShapes.AccountIdentifier),
    // Should income / expenses be displayed (or if absent both)
    income: PropTypes.bool,
    // The currency to fetch the balance in
    currency: PropTypes.string,
    // An optional date range for the balance
    range: PropTypes.object,
    importSlug: PropTypes.string
}

export {
    StatisticalRepository as Service,
    BalanceComponent as Balance
}
