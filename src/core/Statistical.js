import React from "react";
import PropTypes from 'prop-types';

import restAPI from "./RestAPI";
import {Money} from "./Formatters";
import {EntityShapes} from "../config";

class StatisticsService {
    balance({accounts = [], categories = [], contracts = [], expenses = [], onlyIncome, allMoney, dateRange, currency}) {
        return restAPI.post('statistics/balance', {
            accounts,
            categories,
            contracts,
            expenses,
            onlyIncome,
            allMoney,
            dateRange,
            currency
        })
    }

    daily(searchCommand) {
        return restAPI.post('statistics/balance/daily', searchCommand)
    }
}

const service = new StatisticsService()

class BalanceComponent extends React.Component {
    static propTypes = {
        accounts: PropTypes.arrayOf(EntityShapes.Account),
        income: PropTypes.bool,
        currency: PropTypes.string,
        range: PropTypes.object
    }

    state = {
        balance: 0,
        resolved: false
    }

    constructSearch() {
        const {accounts, income, currency, range} = this.props;

        const filter = {
            accounts: accounts || [],
            allMoney: income == null,
            onlyIncome: income,
            currency: currency
        }
        if (range) {
            filter.dateRange = {
                start: range.startString(),
                end: range.endString()
            }
        }

        return filter
    }

    render() {
        const {currency} = this.props;
        const {balance, resolved} = this.state;

        if (!resolved) {
            service.balance(this.constructSearch())
                .then(balanceResponse => this.setState({
                    balance: balanceResponse.balance,
                    resolved: true
                }))
        }

        return (
            <span className='Statistical-Balance'>
                <Money money={balance} currency={currency} />
            </span>
        )
    }
}

export {
    service as Service,
    BalanceComponent as Balance
}
