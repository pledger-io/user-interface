import { mdiCashMinus, mdiCashPlus } from "@mdi/js";
import React from "react";
import { useNavigate } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import CategorizedPieChart from "../../components/graphs/categorized-pie-chart";
import Card from "../../components/layout/card.component";
import { YearMonth } from "../../components/layout/dropdown";

import Grid from "../../components/layout/grid.component";
import NewTransactionDialog from "../../components/transaction/transaction-dialog.component";
import TransactionOverview from "../../components/transaction/transaction-list.component";
import useDateRange from "../../hooks/date-range.hook";

const TransactionGlobalView = () => {
    const navigate = useNavigate()
    const [range] = useDateRange()

    const onDateChange = (year: number, month: number) =>
        navigate(`/transactions/income-expense/${ year }/${ month }`)

    console.log(range)

    return <div className='TransactionOverview'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.accounting'/>
            <BreadCrumbItem label='page.nav.transactions'/>
            <BreadCrumbItem label='page.nav.incomeexpense'/>

            <BreadCrumbMenu>
                <YearMonth
                    onChange={ ({ year, month }) => onDateChange(year, month) }
                    selected={ { month: range.month(), year: range.year() } }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <Grid type='column'
              className='hidden md:grid'
              minWidth='20em'>
            <Card title='page.transactions.expense.category'>
                <CategorizedPieChart id='category-expense'
                                     split='category'
                                     incomeOnly={ false }/>
            </Card>
            <Card title='page.transactions.expense.budget'>
                <CategorizedPieChart id='budget-expense'
                                     split='budget'
                                     incomeOnly={ false }/>
            </Card>
            <Card title='page.transactions.income.category'>
                <CategorizedPieChart id='category-income'
                                     split='category'
                                     incomeOnly={ true }/>
            </Card>
        </Grid>

        <Card title='page.title.transactions.overview'
              actions={ [
                      <NewTransactionDialog type='debit'
                                            icon={ mdiCashPlus }
                                            variant='success'/>,
                      <NewTransactionDialog type='credit'
                                            icon={ mdiCashMinus }
                                            variant='warning'/>] }>

            <TransactionOverview range={ range } transfers={ false }/>
        </Card>
    </div>
}

export default TransactionGlobalView;