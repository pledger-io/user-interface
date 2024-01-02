import { useNavigate } from "react-router-dom";
import { useDateRange } from "../../core/hooks";
import { BreadCrumbItem, BreadCrumbMenu, BreadCrumbs, Dropdown, Layout } from "../../core";
import React from "react";
import { mdiCashMinus, mdiCashPlus, mdiChevronDown, mdiSwapHorizontal } from "@mdi/js";
import NewTransactionDialog from "./new-transaction-dialog";
import TransactionOverview from "./transaction-overview";
import CategorizedPieChart from "../../core/graphs/categorized-pie-chart";

const TransactionGlobalView = ({ transfers } : { transfers: boolean }) => {
    const navigate = useNavigate()
    const [range] = useDateRange()

    const onDateChange = (year: string, month: string) =>
        navigate(`/transactions/${transfers ? 'transfers' : 'income-expense'}/${year}/${month}`)

    return <div className='TransactionOverview'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.accounting'/>
            <BreadCrumbItem label='page.nav.transactions'/>
            {transfers && <BreadCrumbItem label='page.nav.transfers'/>}
            {!transfers && <BreadCrumbItem label='page.nav.incomeexpense'/>}

            <BreadCrumbMenu>
                <Dropdown.YearMonth
                    onChange={ ({ year, month }) => onDateChange(year, month) }
                    selected={ { month: range.month(), year: range.year() } }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        { !transfers && <>
            <Layout.Grid type='column'
                         className='hidden md:grid'
                         minWidth='20em'>
                <Layout.Card title='page.transactions.expense.category'>
                    <CategorizedPieChart id='category-expense'
                                         split='category'
                                         incomeOnly={ false } />
                </Layout.Card>
                <Layout.Card title='page.transactions.expense.budget'>
                    <CategorizedPieChart id='budget-expense'
                                         split='budget'
                                         incomeOnly={ false } />
                </Layout.Card>
                <Layout.Card title='page.transactions.income.category'>
                    <CategorizedPieChart id='category-income'
                                         split='category'
                                         incomeOnly={ true } />
                </Layout.Card>
            </Layout.Grid>
        </> }

        <Layout.Card title='page.title.transactions.overview'
                     actions={[
                         !transfers ? <Dropdown.Dropdown icon={ mdiChevronDown }
                                            key='add-debit-popup'
                                            title='page.transaction.add'>
                             <NewTransactionDialog type='debit'
                                                   icon={ mdiCashPlus }
                                                   variant='success'/>
                             <NewTransactionDialog type='credit'
                                                   icon={ mdiCashMinus }
                                                   variant='warning'/>
                         </Dropdown.Dropdown> : <NewTransactionDialog type='transfer'
                                                                      icon={mdiSwapHorizontal}
                                                                      variant='info'/>

                         ]}>

            <TransactionOverview range={ range } transfers={ transfers } />
        </Layout.Card>
    </div>
}

export default TransactionGlobalView;