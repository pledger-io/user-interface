import { mdiSwapHorizontal } from "@mdi/js";
import React from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import Card from "../../components/layout/card.component";
import { YearMonth } from "../../components/layout/dropdown";
import useDateRange from "../../hooks/date-range.hook";
import NewTransactionDialog from "../../components/transaction/transaction-dialog.component";
import TransactionOverview from "../../components/transaction/transaction-list.component";

const TransactionGlobalView = () => {
    const navigate = useNavigate()
    const [range] = useDateRange()

    const onDateChange = (year: number, month: number) =>
        navigate(`/transactions/transfers/${ year }/${ month }`)

    return <div className='TransactionOverview'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.accounting'/>
            <BreadCrumbItem label='page.nav.transactions'/>
            <BreadCrumbItem label='page.nav.transfers'/>

            <BreadCrumbMenu>
                <YearMonth
                    onChange={ ({ year, month }) => onDateChange(year, month) }
                    selected={ { month: range.month(), year: range.year() } }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <Card title='page.title.transactions.overview'
              actions={ [
                  <NewTransactionDialog type='transfer'
                                        icon={ mdiSwapHorizontal }
                                        variant='info'/>] }>
            <TransactionOverview range={ range } transfers={ true }/>
        </Card>
    </div>
}

export default TransactionGlobalView;