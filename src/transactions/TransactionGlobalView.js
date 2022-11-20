import React from "react"
import {withNavigation, withPathParams, withQueryContext} from "../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Card, Charts,
    Dates,
    Dialog,
    Dropdown,
    Pagination,
    Resolver
} from "../core";
import {TransactionTable} from "./TransactionTable";
import RestAPI from "../core/RestAPI";
import {mdiCartPlus, mdiCashPlus, mdiPageNext, mdiPlusBox, mdiSwapHorizontal} from "@mdi/js";
import {Entity, Form, SubmitButton} from "../core/form";
import PropTypes from "prop-types";

class GlobalService {
    search({range, page, transfers = false}) {
        return RestAPI.post('transactions', {
            dateRange: {
                start: range.startString(),
                end: range.endString()
            },
            page: page,
            transfers: transfers
        })
    }
}

const service = new GlobalService();

class AccountSelectorPopup extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(['debit', 'credit', 'transfer']),
        icon: PropTypes.string,
        variant: PropTypes.oneOf(['success', 'warning', 'info'])
    }

    render() {
        const {type, variant, icon} = this.props

        return <Form onSubmit={({account}) => this.onSelect(account)} entity='transaction'>
            <Dialog.Dialog
                title='page.accounts.select'
                className='Large'
                openButton={
                    <Buttons.Button label={`page.transactions.${type}.add`}
                                    variant={variant}
                                    icon={icon}/>}
                actions={[
                    <SubmitButton label='common.action.next'
                                  variant='success'
                                  type='submit'
                                  icon={mdiPageNext}
                                  key='next-action'/>]}>
                <Entity.ManagedAccount id='account'
                                       required
                                       title='page.accounts.reconcile.account'/>
            </Dialog.Dialog>
        </Form>
    }

    onSelect(account) {
        const {navigate, type} = this.props
        navigate(`${Resolver.Account.resolveUrl(account)}/transactions/add/${type}`)
    }
}

const AccountSelectorPopupWithNav = withNavigation(AccountSelectorPopup)

class TransactionGlobalView extends React.Component {
    static propTypes = {
        transfers: PropTypes.bool.isRequired
    }

    state = {
        paging: {
            page: 1,
            pagination: {}
        },
        charts: {
            balance: []
        }
    }

    constructor(props, context) {
        super(props, context);

        const {queryContext, pathContext} = this.props
        queryContext.resolved = ({page,}) => {
            setTimeout(() => {
                this.setState({
                    paging: {
                        ...this.state.paging,
                        page: page
                    }
                })
            }, 10)
        }
        pathContext.resolved = ({year, month}) => {
            year = year || new Date().getFullYear()
            month = month || new Date().getMonth()

            this.setState({
                range: Dates.Ranges.forMonth(year, month)
            })
            setTimeout(() => {
                this.pageChanged(this.state.paging.page)
                this.refreshGraphs()
            }, 50)
        }
    }

    pageChanged(page) {
        const {transfers} = this.props
        const {range = null} = this.state
        if (range === null) {
            return
        }

        service.search({range, page, transfers})
            .then(resultPage => this.setState({
                transactions: resultPage.content,
                transfers: transfers,
                paging: {
                    page: page,
                    pagination: resultPage.info
                }
            }))
    }

    refreshGraphs() {
        const {range} = this.state
        Charts.SeriesProvider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true,
        }).then(result => this.setState({
            charts: {
                balance: [result]
            }
        }))
    }

    render() {
        const {transactions = [], paging: {page, pagination: {pageSize, records}}, charts} = this.state

        return (
            <div className='TransactionOverview'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.accounting'/>
                    <BreadCrumbItem label='page.nav.transactions'/>

                    {this.renderBreadcrumbMenu()}
                </BreadCrumbs>

                <Card title='common.account.balance'>
                    <Charts.Chart height={75}
                                  id='dashboard-balance-graph'
                                  dataSets={charts.balance}>
                    </Charts.Chart>
                </Card>

                <Card title='page.title.transactions.overview'
                      actions={[
                          <Dropdown.Dropdown icon={mdiPlusBox} key='add-debit-popup'>
                              <AccountSelectorPopupWithNav type='debit' icon={mdiCashPlus} variant='success'/>
                              <AccountSelectorPopupWithNav type='credit' icon={mdiCartPlus} variant='warning'/>
                              <AccountSelectorPopupWithNav type='transfer' icon={mdiSwapHorizontal} variant='info'/>
                          </Dropdown.Dropdown>
                      ]}>
                    <TransactionTable transactions={transactions}/>

                    <Pagination.Paginator page={page}
                                          records={records}
                                          pageSize={pageSize}/>
                </Card>
            </div>
        )
    }

    renderBreadcrumbMenu() {
        const {range = null} = this.state
        const {navigate, transfers} = this.props

        const dateChanged = (year, month) => {
            navigate(`/transactions/${transfers ? 'transfers' : 'income-expense'}/${year}/${month}`)
        }

        if (range !== null) {
            return (
                <BreadCrumbMenu>
                    <Dropdown.YearMonth
                        onChange={({year, month}) => dateChanged(year, month)}
                        selected={{month: range.month(), year: range.year()}}/>
                </BreadCrumbMenu>
            )
        }
        return null
    }
}

// Global transaction overview page
const transactionGlobalView = withNavigation(withPathParams(withQueryContext(TransactionGlobalView)))

export {
    transactionGlobalView as TransactionGlobalView
}
