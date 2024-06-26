import { useNavigate } from "react-router-dom";
import { useDateRange } from "../../core/hooks";
import { BreadCrumbItem, BreadCrumbMenu, BreadCrumbs, Dropdown } from "../../core";
import React from "react";
import { mdiCashMinus, mdiCashPlus, mdiChevronDown, mdiSwapHorizontal } from "@mdi/js";
import NewTransactionDialog from "./new-transaction-dialog";
import TransactionOverview from "./transaction-overview";
import CategorizedPieChart from "../../core/graphs/categorized-pie-chart";

import Grid from "../../components/layout/grid.component";
import Card from "../../components/layout/card.component";

const TransactionGlobalView = ({ transfers } : { transfers: boolean }) => {
    const navigate = useNavigate()
    const [range] = useDateRange()

    const onDateChange = (year: number, month: number) =>
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
            <Grid type='column'
                         className='hidden md:grid'
                         minWidth='20em'>
                <Card title='page.transactions.expense.category'>
                    <CategorizedPieChart id='category-expense'
                                         split='category'
                                         incomeOnly={ false } />
                </Card>
                <Card title='page.transactions.expense.budget'>
                    <CategorizedPieChart id='budget-expense'
                                         split='budget'
                                         incomeOnly={ false } />
                </Card>
                <Card title='page.transactions.income.category'>
                    <CategorizedPieChart id='category-income'
                                         split='category'
                                         incomeOnly={ true } />
                </Card>
            </Grid>
        </> }

        <Card title='page.title.transactions.overview'
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
        </Card>
    </div>
}

export default TransactionGlobalView;