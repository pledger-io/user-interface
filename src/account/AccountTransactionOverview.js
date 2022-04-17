import React from "react";
import {mdiCartPlus, mdiCashPlus, mdiSwapHorizontal} from "@mdi/js";

import {withNavigation, withPathParams, withQueryContext} from "../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Card,
    Charts,
    Dates,
    Dropdown,
    Pagination, Resolver,
} from "../core";
import {TransactionTable} from "../transactions/TransactionTable";
import restAPI from "../core/RestAPI";

import '../assets/css/TransactionOverview.scss'

class OverviewService {
    account(id) {
        return restAPI.get(`accounts/${id}`)
    }

    transactions(id, range, page) {
        return restAPI.post(`accounts/${id}/transactions`, {
            page: page,
            dateRange: {
                start: range.startString(),
                end: range.endString()
            }
        })
    }
}
const service = new OverviewService()
const TYPE_MAPPING = {
    expense: 'creditor',
    revenue: 'debtor',
    own: 'accounts'
}

class AccountTransactionOverview extends React.Component {
    state = {
        account: {
            id: NaN,
            type: null
        },
        type: null,
        routeType: null,
        transactions: null,
        pagination: {},
        range: null,
        charts: {
            balance: []
        },
        page: 1
    }

    constructor(props, context) {
        super(props, context);

        const {queryContext, pathContext} = this.props
        queryContext.resolved = ({page, }) => {
            setTimeout(() => {
                this.setState({
                    page: page
                })
            }, 10)
        }
        pathContext.resolved = ({type, id, year, month}) => {
            year = year || new Date().getFullYear()
            month = month || new Date().getMonth()

            service.account(id)
                .then(account => {
                    this.setState({
                        ...this.state,
                        type: TYPE_MAPPING[type],
                        routeType: type,
                        account: account,
                        range: Dates.Ranges.forMonth(year, month)
                    })
                    this.pageChanged(this.state.page)
                    this.refreshGraphs()
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

    pageChanged(page) {
        const {account = null, range} = this.state
        if (!isNaN(account.id)) {
            this.setState({
                ...this.state,
                transactions: null
            })
            service.transactions(account.id, range, page)
                .then(resultPage => this.setState({
                    ...this.state,
                    page: parseInt(page) || 1,
                    transactions: resultPage.content,
                    pagination: resultPage.info
                }))
        }
    }

    render() {
        const {account, type, transactions, charts, page, pagination: {pageSize, records}} = this.state

        return (
            <div className='TransactionOverview'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings' />
                    <BreadCrumbItem label='page.nav.accounts' />
                    <BreadCrumbItem label={`page.nav.accounts.${type}`} />
                    <BreadCrumbItem message={account.name} />

                    {this.renderBreadcrumbMenu()}
                </BreadCrumbs>

                <Card title='common.account.balance'>
                    <Charts.Chart height={75}
                                  id='dashboard-balance-graph'
                                  dataSets={charts.balance}>
                    </Charts.Chart>
                </Card>

                <Card title='page.title.transactions.overview'>
                    <div className="BalanceButtons">
                        <Buttons.Button label='page.transactions.debit.add'
                                        href={`${Resolver.Account.resolveUrl(account)}/transactions/add/debit`}
                                        variant='success'
                                        className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                        icon={mdiCashPlus}/>
                        <Buttons.Button label='page.transactions.credit.add'
                                        href={`${Resolver.Account.resolveUrl(account)}/transactions/add/credit`}
                                        className={Resolver.Account.isCreditor(account) ? 'Hidden' : ''}
                                        variant='warning'
                                        icon={mdiCartPlus}/>
                        <Buttons.Button label='page.transactions.transfer.add'
                                        href={`${Resolver.Account.resolveUrl(account)}/transactions/add/transfer`}
                                        className={Resolver.Account.isManaged(account) ? 'Hidden' : ''}
                                        variant='primary'
                                        icon={mdiSwapHorizontal}/>
                    </div>

                    <TransactionTable account={account} transactions={transactions}/>

                    <Pagination.Paginator page={page} records={records}
                                          pageSize={pageSize}/>
                </Card>
            </div>
        )
    }

    renderBreadcrumbMenu() {
        const {range, routeType, account: {id}} = this.state
        const {navigate} = this.props
        const dateChanged = (year, month) => {
            navigate(`/accounts/${routeType}/${id}/transactions/${year}/${month}`)
        }

        if (range !== null) {
            return (
                <BreadCrumbMenu>
                    <Dropdown.YearMonth
                        onChange={({year, month}) => dateChanged(year, month)}
                        selected={{month: range.month(), year: range.year()}} />
                </BreadCrumbMenu>
            )
        }
        return null
    }
}

const view = withNavigation(withQueryContext(withPathParams(AccountTransactionOverview)))

export {
    view as AccountTransactionOverview
}
