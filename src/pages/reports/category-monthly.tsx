import React, { useEffect, useState } from "react";
import { Currency, Year } from "../../components/layout/dropdown";
import { useNavigate, useParams } from "react-router";

import { CurrencyRepository } from "../../core/RestAPI";
import CategoryRepository from "../../core/repositories/category-repository";
import { Category } from "../../types/types";

import MonthlySpendingComponent from "../../components/reports/category-monthly/monthly-spending.component";
import CategorizedMonthlySpendingComponent from "../../components/reports/category-monthly/categorized-monthly-spending.component";
import CategoryGraph from "../../components/reports/category-monthly/montly-categorized-chart";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";

import '../../assets/css/CategorieReportView.scss'
import DateRangeService from "../../service/date-range.service";

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

    const onDateChanged = ({ newYear = year, newCurrency = currency }) => navigate(`/reports/monthly-category/${newYear}/${newCurrency}`)

    if (!categories) return <Loading />
    return (
        <div className='CategoryReport'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.title.reports.default' />
                <BreadCrumbItem label='page.reports.category.title' />
                <BreadCrumbItem message={`${range.year()}`} />
                <BreadCrumbItem message={currencySymbol} />
                <BreadCrumbMenu className='flex justify-end'>
                    <Currency currency={currency} onChange={currency => onDateChanged({ newCurrency: currency.code })} />
                    <Year year={range.year()} onChange={year => onDateChanged({ newYear: `${year}` })}/>
                </BreadCrumbMenu>
            </BreadCrumbs>

            <div className='Columns'>
                <Card title='page.reports.category.title'>
                    <CategoryGraph categories={ categories }
                                   year={ parseInt(year) }
                                   currencySymbol={ currencySymbol } />
                </Card>
                <Card title='page.reports.category.monthly'>
                    <MonthlySpendingComponent categories={categories} range={range}/>
                </Card>
            </div>

            <Card>
                <CategorizedMonthlySpendingComponent categories={categories} year={range.year()} />
            </Card>
        </div>
    )
}

export default CategoryReportView
