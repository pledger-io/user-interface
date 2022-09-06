import React from 'react'
import {withPathParams} from "../../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbs, Buttons,
    Card,
    Charts,
    Dates,
    Formats, Loading,
    Pagination, Resolver,
    Statistical,
    Translations
} from "../../core";

import '../../assets/css/LiabiliryView.scss'
import restAPI from "../../core/RestAPI";
import {TransactionTable} from "../../transactions/TransactionTable";
import {mdiCashPlus} from "@mdi/js";

class LiabilityView extends React.Component {
    state = {
        account: {},
        range: {},
        charts: {
            balance: []
        },
        transactions: [],
        openingTransaction: {},
        pagination: {},
        page: 0
    }

    constructor(props, context) {
        super(props, context);

        const {pathContext} = this.props
        pathContext.resolved = ({id}) => {
            restAPI.get(`accounts/${id}`)
                .then(account => {
                    this.setState({
                        account: account,
                        range: Dates.Ranges.forRange(
                            account.history.firstTransaction,
                            account.history.lastTransaction)
                    })
                    this.loadTransactionPage(this.state.page)
                    this.refreshGraphs()
                })
            restAPI.get(`accounts/${id}/transactions/first?description=Opening balance`)
                .then(transaction => {
                    this.setState({
                        openingTransaction: transaction
                    })
                })
        }
    }

    refreshGraphs() {
        const {account, range} = this.state
        Charts.SeriesProvider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true,
            accounts: [account]
        }).then(result => this.setState({
            charts: {
                balance: [result]
            }
        }))
    }

    loadTransactionPage(page) {
        const {account: {id}, range} = this.state

        restAPI.post(`accounts/${id}/transactions`, {
            page: page,
            dateRange: {
                start: range.startString(),
                end: range.endString()
            }
        }).then(({content, info}) => this.setState({
            page: parseInt(page),
            transactions: content,
            pagination: info
        }))
    }

    render() {
        const {account, range, charts, page, pagination: {pageSize, records}, transactions, openingTransaction} = this.state
        if (isNaN(account.id)) {
            return <Loading />
        }

        return (
            <div className="LiabilityView">
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label='page.nav.accounts.liability'/>
                    <BreadCrumbItem message={account.name}/>
                    <BreadCrumbItem label='page.nav.transactions'/>
                </BreadCrumbs>

                <div className="Summary">
                    <Card>
                        <h1>{account.name}</h1>
                        <div className="Details">
                            <label><Translations.Translation label='Account.interest'/></label>
                            <Formats.Percent percentage={account.interest?.interest}/>
                        </div>
                        <div className="Details">
                            <label><Translations.Translation label='Account.interestPeriodicity'/></label>
                            <Translations.Translation label={`Periodicity.${account.interest?.periodicity}`}/>
                        </div>
                        <div className="Details OpenBalance">
                            <label><Translations.Translation label='page.accounts.liability.startBalance'/></label>
                            <Formats.Money money={openingTransaction.amount} currency={account.currency} />
                        </div>
                        <div className="Details">
                            <label><Translations.Translation label='page.accounts.liability.paid'/></label>
                            <Statistical.Balance accounts={[account]} income={false}/>
                        </div>
                    </Card>
                    <Card>
                        <h1><Translations.Translation label='common.account.balance'/></h1>
                        <h4>
                            <Translations.Translation label={`common.month.${range.start?.getMonth() + 1}`} /> {range.start?.getFullYear()}
                            -
                            <Translations.Translation label={`common.month.${range.end?.getMonth() + 1}`} /> {range.end?.getFullYear()}
                        </h4>

                        <Charts.Chart height={100}
                                      id='liability-balance-graph'
                                      dataSets={charts.balance} />
                    </Card>
                </div>

                <Card title='page.title.transactions.overview'>
                    <Buttons.Button label='page.account.liability.payment.add'
                                    href={`${Resolver.Account.resolveUrl(account)}/transactions/add`}
                                    variant='success'
                                    className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                    icon={mdiCashPlus}/>

                    <TransactionTable account={account} transactions={transactions}/>

                    <Pagination.Paginator page={page} records={records}
                                          pageSize={pageSize}/>
                </Card>
            </div>
        )
    }
}

const viewWithParams = withPathParams(LiabilityView)
export {
    viewWithParams as LiabilityView
}
