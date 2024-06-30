import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BalanceComponent from "../../components/balance.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import Card from "../../components/layout/card.component";
import CurrencyDropdown from "../../components/layout/dropdown/currency.component";
import YearDropdown from "../../components/layout/dropdown/year.component";
import Translation from "../../components/localization/translation.component";
import AccountBalance from "../../components/reports/income-expense/account-balance";
import TopAccountTable from "../../components/reports/income-expense/top-account";

import YearBalanceChart from "../../components/reports/income-expense/year-balance-chart";
import { Dates } from "../../core";
import { CurrencyRepository } from "../../core/RestAPI";
import { Currency } from "../../core/types";


function IncomeExpenseView() {
    const [currencySymbol, setCurrencySymbol] = useState('')
    const [range, setRange] = useState(Dates.Ranges.currentYear())
    const { year = range.year(), currency = 'EUR' } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setRange(Dates.Ranges.forYear(parseInt(year)))
    }, [year])
    useEffect(() => {
        CurrencyRepository.get(currency)
            .then((c: Currency) => setCurrencySymbol(c.symbol))
    }, [currency])

    const onDateChanged = ({ newYear = year, newCurrency = currency }) => {
        navigate(`/reports/income-expense/${ newYear }/${ newCurrency }`)
    }

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.reports.default'/>
            <BreadCrumbItem label='page.reports.default.title'/>
            <BreadCrumbMenu>
                <div className='inline-flex'>
                    <CurrencyDropdown currency={ currency }
                                      onChange={ (currency: Currency) => onDateChanged({ newCurrency: currency.code }) }/>
                    <YearDropdown year={ parseInt(year) }
                                  onChange={ year => onDateChanged({ newYear: year }) }/>
                </div>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <Card title='page.reports.default.title'>
            <YearBalanceChart year={ year }
                              currencySymbol={ currencySymbol }
                              currency={ currency }/>
        </Card>

        <div className='block md:flex gap-4'>
            <Card title='page.reports.default.balances' className='flex-1'>
                <AccountBalance year={ parseInt(year) } currency={ currency }/>
            </Card>
            <Card title='page.reports.default.title' className='flex-1'>
                <table className='w-full [&>tbody>tr>td]:pb-2'>
                    <tbody>
                    <tr>
                        <td><Translation label='common.in'/></td>
                        <td className='text-right w-28'>
                            <BalanceComponent currency={ currency }
                                              income={ true }
                                              range={ range }/></td>
                    </tr>
                    <tr>
                        <td><Translation label='common.out'/></td>
                        <td className='text-right'>
                            <BalanceComponent currency={ currency }
                                              income={ false }
                                              range={ range }/></td>
                    </tr>
                    <tr>
                        <td className='text-right italic font-bold'><Translation label='common.difference'/>:</td>
                        <td className='text-right border-t-2'>
                            <BalanceComponent currency={ currency }
                                              range={ range }/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Card>
        </div>

        <div className='block md:flex gap-4'>
            <Card title='page.reports.default.top.debit' className='flex-1'>
                <TopAccountTable year={ year } type={ 'debit' }/>
            </Card>
            <Card title='page.reports.default.top.credit' className='flex-1'>
                <TopAccountTable year={ year } type={ 'creditor' }/>
            </Card>
        </div>
    </>
}

export default IncomeExpenseView