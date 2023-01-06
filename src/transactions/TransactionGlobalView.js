import React, {useEffect, useState} from "react"
import {useDateRange, useQueryParam, withNavigation} from "../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Card,
    Charts,
    Dialog,
    Dropdown,
    Pagination,
    Resolver
} from "../core";
import {TransactionTable} from "./TransactionTable";
import {TransactionRepository} from "../core/RestAPI";
import {mdiCartPlus, mdiCashPlus, mdiPageNext, mdiPlusBox, mdiSwapHorizontal} from "@mdi/js";
import {Entity, Form, SubmitButton} from "../core/form";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

const AccountSelectorPopup = ({variant, icon, type}) => {
    const navigate = useNavigate()

    const onSelect = account => navigate(`${Resolver.Account.resolveUrl(account)}/transactions/add/${type}`)

    return <>
        <Form onSubmit={({account}) => onSelect(account)} entity='transaction'>
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
    </>
}
AccountSelectorPopup.propTypes = {
    type: PropTypes.oneOf(['debit', 'credit', 'transfer']),
    icon: PropTypes.string,
    variant: PropTypes.oneOf(['success', 'warning', 'info'])
}

export const TransactionGlobalView = ({transfers}) => {
    const navigate                           = useNavigate()
    const [page]                             = useQueryParam('page', "1")
    const [transactions, setTransactions]    = useState([])
    const [pagination, setPagination]        = useState({})
    const [balanceSeries, setBalanceSeries]  = useState([])
    const [range]                            = useDateRange()

    useEffect(() => {
        Charts.SeriesProvider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true,
        }).then(result => setBalanceSeries([result]))
    }, [range])

    useEffect(() => {
        TransactionRepository.search({range, page, transfers})
            .then(response => setTransactions(response.content) || setPagination(response.info))
    }, [page, range, transfers])

    const onDateChange = (year, month) => navigate(`/transactions/${transfers ? 'transfers' : 'income-expense'}/${year}/${month}`)
    return <>
        <div className='TransactionOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.accounting'/>
                <BreadCrumbItem label='page.nav.transactions'/>

                <BreadCrumbMenu>
                    <Dropdown.YearMonth
                        onChange={({year, month}) => onDateChange(year, month)}
                        selected={{month: range.month(), year: range.year()}}/>
                </BreadCrumbMenu>
            </BreadCrumbs>

            <Card title='common.account.balance'>
                <Charts.Chart height={75}
                              id='dashboard-balance-graph'
                              dataSets={balanceSeries}>
                </Charts.Chart>
            </Card>

            <Card title='page.title.transactions.overview'
                  actions={[
                      <Dropdown.Dropdown icon={mdiPlusBox} key='add-debit-popup'>
                          <AccountSelectorPopup type='debit' icon={mdiCashPlus} variant='success'/>
                          <AccountSelectorPopup type='credit' icon={mdiCartPlus} variant='warning'/>
                          <AccountSelectorPopup type='transfer' icon={mdiSwapHorizontal} variant='info'/>
                      </Dropdown.Dropdown>
                  ]}>
                <TransactionTable transactions={transactions}/>

                <Pagination.Paginator page={parseInt(page)}
                                      records={pagination.records}
                                      pageSize={pagination.pageSize}/>
            </Card>
        </div>
    </>
}
