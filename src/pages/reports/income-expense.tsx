import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BalanceComponent from "../../components/balance.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import CurrencyDropdown from "../../components/layout/dropdown/currency.component";
import YearDropdown from "../../components/layout/dropdown/year.component";
import Translation from "../../components/localization/translation.component";
import AccountBalance from "../../components/reports/income-expense/account-balance";
import TopAccountTable from "../../components/reports/income-expense/top-account";

import YearBalanceChart from "../../components/reports/income-expense/year-balance-chart";
import { i10n } from "../../config/prime-locale";
import { CurrencyRepository } from "../../core/RestAPI";
import DateRangeService from "../../service/date-range.service";
import { Currency } from "../../types/types";


function IncomeExpenseView() {
  const [currencySymbol, setCurrencySymbol] = useState('')
  const [range, setRange] = useState(DateRangeService.currentYear())
  const { year = range.year(), currency = 'EUR' } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (year) setRange(DateRangeService.forYear(parseInt(year as string)))
  }, [year])
  useEffect(() => {
    CurrencyRepository.get(currency)
      .then((c: Currency) => setCurrencySymbol(c.symbol))
  }, [currency])

  const onDateChanged = ({ newYear = year, newCurrency = currency }) => {
    navigate(`/reports/income-expense/${ newYear }/${ newCurrency }`)
  }

  const parsedYear = parseInt(year as string)
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.title.reports.default'/>
      <BreadCrumbItem label='page.reports.default.title'/>
      <BreadCrumbMenu>
        <div className='inline-flex'>
          <CurrencyDropdown currency={ currency }
                            onChange={ (currency: Currency) => onDateChanged({ newCurrency: currency.code }) }/>
          <YearDropdown year={ parsedYear }
                        onChange={ year => onDateChanged({ newYear: year }) }/>
        </div>
      </BreadCrumbMenu>
    </BreadCrumbs>

    <div className='px-2 flex flex-col gap-2 mt-4'>
      <Card title={ i10n('page.reports.default.title') }>
        <YearBalanceChart year={ parsedYear }
                          currencySymbol={ currencySymbol }
                          currency={ currency }/>
      </Card>

      <div className='block md:flex gap-2'>
        <Card title={ i10n('page.reports.default.balances') } className='flex-1'>
          <AccountBalance year={ parsedYear } currency={ currency }/>
        </Card>
        <Card title={ i10n('page.reports.default.title') } className='flex-1'>
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

      <div className='block md:flex gap-2'>
        <Card title={ i10n('page.reports.default.top.debit') } className='flex-1'>
          <TopAccountTable year={ parsedYear } type={ 'debit' }/>
        </Card>
        <Card title={ i10n('page.reports.default.top.credit') } className='flex-1'>
          <TopAccountTable year={ parsedYear } type={ 'creditor' }/>
        </Card>
      </div>
    </div>
  </>
}

export default IncomeExpenseView
