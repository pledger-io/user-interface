import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Currency, Year } from "../../components/layout/dropdown";
import Loading from "../../components/layout/loading.component";
import CategorizedMonthlySpendingComponent
  from "../../components/reports/category-monthly/categorized-monthly-spending.component";
import MonthlySpendingComponent from "../../components/reports/category-monthly/monthly-spending.component";
import CategoryGraph from "../../components/reports/category-monthly/montly-categorized-chart";
import { i10n } from "../../config/prime-locale";
import CategoryRepository from "../../core/repositories/category-repository";
import { CurrencyRepository } from "../../core/RestAPI";
import DateRangeService from "../../service/date-range.service";
import { Category } from "../../types/types";

const CategoryReportView = () => {
  const [categories, setCategories] = useState<Category[]>()
  const [range, setRange] = useState(DateRangeService.currentYear)
  const [currencySymbol, setCurrencySymbol] = useState('')
  const { currency = 'EUR', year = "" + new Date().getFullYear() } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    CategoryRepository.all()
      .then(setCategories)
  }, [])
  useEffect(() => {
    if (year) setRange(DateRangeService.forYear(parseInt(year)))
  }, [year])
  useEffect(() => {
    CurrencyRepository.get(currency)
      .then(({ symbol }) => setCurrencySymbol(symbol))
  }, [currency])

  const onDateChanged = ({
                           newYear = year,
                           newCurrency = currency
                         }) => navigate(`/reports/monthly-category/${ newYear }/${ newCurrency }`)

  if (!categories) return <Loading/>
  return (
    <div className='CategoryReport'>
      <BreadCrumbs>
        <BreadCrumbItem label='page.title.reports.default'/>
        <BreadCrumbItem label='page.reports.category.title'/>
        <BreadCrumbItem message={ `${ range.year() }` }/>
        <BreadCrumbItem message={ currencySymbol }/>
        <BreadCrumbMenu className='flex justify-end'>
          <Currency currency={ currency } onChange={ currency => onDateChanged({ newCurrency: currency.code }) }/>
          <Year year={ range.year() } onChange={ year => onDateChanged({ newYear: `${ year }` }) }/>
        </BreadCrumbMenu>
      </BreadCrumbs>

      <div className='flex gap-2 mx-2 my-4'>
        <Panel header={ i10n('page.reports.category.title') } className='flex-2'>
          <CategoryGraph categories={ categories }
                         year={ parseInt(year) }
                         currencySymbol={ currencySymbol }/>
        </Panel>
        <Panel header={ i10n('page.reports.category.monthly') } className='flex-1 min-w-[25rem]'>
          <MonthlySpendingComponent categories={ categories } range={ range }/>
        </Panel>
      </div>

      <Card className='mx-2 my-4'>
        <CategorizedMonthlySpendingComponent currency={ currency } year={ range.year() }/>
      </Card>
    </div>
  )
}

export default CategoryReportView
