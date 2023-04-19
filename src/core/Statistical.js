import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import restAPI from "./repositories/rest-api";
import {Money} from "./Formatters";
import {EntityShapes} from "../config";
import {Loading} from "./index";

const StatisticsService = (() => {
    return {
        balance: ({accounts = [], categories = [], contracts = [], expenses = [], onlyIncome, allMoney, dateRange, currency}) =>
            restAPI.post('statistics/balance', {accounts, categories, contracts, expenses, onlyIncome, allMoney, dateRange, currency}),
        daily: searchCommand => restAPI.post('statistics/balance/daily', searchCommand),
        split: (splitBy, searchCommand) => restAPI.post(`statistics/balance/partitioned/${encodeURI(splitBy)}`, searchCommand)
    }
})()

/**
 * The balance component can display a computed balance on a given search command. Where the search command can
 * be setup using the properties of the component.
 */
const BalanceComponent = ({accounts = [], categories = [], expenses = [],  income, currency, range}) => {
    const [balance, setBalance] = useState(null)

    useEffect(() => {
        const filter = {
            accounts: accounts,
            allMoney: income == null,
            expenses: expenses,
            onlyIncome: income,
            currency: currency,
            categories: categories
        }
        if (range) {
            filter.dateRange = {
                start: range.startString(),
                end: range.endString()
            }
        }

        StatisticsService.balance(filter)
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
    range: PropTypes.object
}

export {
    StatisticsService as Service,
    BalanceComponent as Balance
}
