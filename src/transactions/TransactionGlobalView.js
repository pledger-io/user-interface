import React, {useEffect, useState} from "react"
import {useDateRange, useQueryParam} from "../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Charts,
    Dialog,
    Dropdown,
    Layout,
    Pagination,
    Resolver,
    Translations
} from "../core";
import {TransactionTable} from "./TransactionTable";
import {TransactionRepository} from "../core/RestAPI";
import {mdiCartPlus, mdiCashPlus, mdiChevronDown, mdiFilter, mdiPageNext, mdiSwapHorizontal} from "@mdi/js";
import {Entity, Form, Input, SubmitButton} from "../core/form";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

import '../assets/css/TransactionOverview.scss'

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

const TransactionFilterOptions = ({onChange = _ => {}}) => {
    const onSubmit = entity => {
        const filter = {}
        if (entity.account) filter.account = entity.account.name
        if (entity.category) filter.category = {id: entity.category.id}
        if (entity.budget) filter.budget = {id: entity.budget.id}
        filter.onlyIncome = entity.onlyIncome
        filter.onlyExpense = entity.onlyExpense
        filter.description = entity.description
        if (entity.currency) filter.currency = entity.currency
        onChange(filter)
    }
    return <div className='TransactionFilters'>
        <Form onSubmit={onSubmit} entity='Transaction'>
            <fieldset>
                <legend><Translations.Translation label='page.transactions.filter'/></legend>
                <div className="Columns">
                    <Entity.Account id='account' title='page.transactions.filter.account' type='creditor' />
                    <Input.Text id='description' title='page.transaction.filter.description' />
                    <Entity.Currency id='currency' title='page.transaction.filter.currency' />
                </div>
                <div className="Columns">
                    <Entity.Category id='category' title='page.transactions.filter.category' />
                    <Entity.Budget id='budget' title='page.transactions.filter.budget' />
                    <div />
                </div>
                <div className='Input'>
                    <Input.Toggle id='onlyExpense' />&nbsp;<Translations.Translation label='page.transaction.filter.expense' />
                </div>
                <div className='Input'>
                    <Input.Toggle id='onlyIncome' />&nbsp;<Translations.Translation label='page.transaction.filter.income' />
                </div>

                <Buttons.Button type='submit'
                                label='page.transactions.filter'
                                icon={mdiFilter}
                                variant='info'
                                variantType='outline'
                                className='ActionRow'/>
            </fieldset>
        </Form>
    </div>
}

const TransactionOverviewComponent = ({range, transfers}) => {
    const [page]                             = useQueryParam('page', "1")
    const [searchCommand, setSearchCommand]  = useState({})
    const [transactions, setTransactions]    = useState([])
    const [pagination, setPagination]        = useState({})

    useEffect(() => {
        if (!searchCommand.hasOwnProperty('dateRange')) return

        setTransactions(undefined)
        TransactionRepository.search(searchCommand)
            .then(response => setTransactions(response.content) || setPagination(response.info))
    }, [searchCommand])
    useEffect(() => {
        setSearchCommand({transfers})
    }, [transfers])

    useEffect(() => {
        setSearchCommand(previous => {
            return {
                ...previous,
                dateRange: {
                    start: range.startString(),
                    end: range.endString()
                },
                page
            }
        })
    }, [page, range, transfers])

    const onFilterChange = filter => setSearchCommand(oldValue => {
        return {
            ...oldValue,
            ...filter
        }
    })

    return <>
        {!transfers && <TransactionFilterOptions onChange={onFilterChange}/>}

        <TransactionTable transactions={transactions}/>

        <Pagination.Paginator page={parseInt(page)}
                              records={pagination.records}
                              pageSize={pagination.pageSize}/>
    </>
}

export const TransactionGlobalView = ({transfers}) => {
    const navigate                           = useNavigate()
    const [range]                            = useDateRange()

    const onDateChange = (year, month) => navigate(`/transactions/${transfers ? 'transfers' : 'income-expense'}/${year}/${month}`)
    return <>
        <div className='TransactionOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.accounting'/>
                <BreadCrumbItem label='page.nav.transactions'/>
                {transfers && <BreadCrumbItem label='page.nav.transfers'/>}
                {!transfers && <BreadCrumbItem label='page.nav.incomeexpense'/>}

                <BreadCrumbMenu>
                    <Dropdown.YearMonth
                        onChange={({year, month}) => onDateChange(year, month)}
                        selected={{month: range.month(), year: range.year()}}/>
                </BreadCrumbMenu>
            </BreadCrumbs>

            {!transfers && <>
                <Layout.Grid type='column' minWidth='35em'>
                    <Layout.Card title='page.transactions.expense.category'>
                        <Charts.CategorizedPieChart id='category-expense' range={range} split='category' incomeOnly={false} />
                    </Layout.Card>
                    <Layout.Card title='page.transactions.expense.budget'>
                        <Charts.CategorizedPieChart id='budget-expense' range={range} split='budget' incomeOnly={false} />
                    </Layout.Card>
                    <Layout.Card title='page.transactions.income.category'>
                        <Charts.CategorizedPieChart id='category-income' range={range} split='category' incomeOnly={true} />
                    </Layout.Card>
                </Layout.Grid>
            </>}

            <Layout.Card title='page.title.transactions.overview'
                  actions={[
                      <Dropdown.Dropdown icon={mdiChevronDown} key='add-debit-popup' title='page.transaction.add'>
                          <AccountSelectorPopup type='debit' icon={mdiCashPlus} variant='success'/>
                          <AccountSelectorPopup type='credit' icon={mdiCartPlus} variant='warning'/>
                          <AccountSelectorPopup type='transfer' icon={mdiSwapHorizontal} variant='info'/>
                      </Dropdown.Dropdown>
                  ]}>

                <TransactionOverviewComponent range={range} transfers={transfers} />
            </Layout.Card>
        </div>
    </>
}
