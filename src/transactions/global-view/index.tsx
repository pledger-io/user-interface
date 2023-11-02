import {useNavigate} from "react-router-dom";
import {useDateRange} from "../../core/hooks";
import {BreadCrumbItem, BreadCrumbMenu, BreadCrumbs, Charts, Dropdown, Layout} from "../../core";
import React from "react";
import {mdiCashMinus, mdiCashPlus, mdiChevronDown, mdiSwapHorizontal} from "@mdi/js";
import NewTransactionDialog from "./new-transaction-dialog";
import TransactionOverview from "./transaction-overview";

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
                    onChange={ ({year, month}) => onDateChange(year, month) }
                    selected={ {month: range.month(), year: range.year()} }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        { !transfers && <>
            <Layout.Grid type='column' minWidth='20em'>
                <Layout.Card title='page.transactions.expense.category'>
                    <Charts.CategorizedPieChart id='category-expense'
                                                range={ range }
                                                split='category'
                                                incomeOnly={ false } />
                </Layout.Card>
                <Layout.Card title='page.transactions.expense.budget'>
                    <Charts.CategorizedPieChart id='budget-expense'
                                                range={ range }
                                                split='budget'
                                                incomeOnly={ false } />
                </Layout.Card>
                <Layout.Card title='page.transactions.income.category'>
                    <Charts.CategorizedPieChart id='category-income'
                                                range={ range }
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