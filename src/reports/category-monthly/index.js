import React, {useEffect, useState} from "react";
import {BreadCrumbItem, BreadCrumbMenu, BreadCrumbs, Dates, Dropdown, Layout, Loading} from "../../core";
import {useNavigate, useParams} from "react-router-dom";
import {CategoryRepository, CurrencyRepository} from "../../core/RestAPI";

import CategoryGraph from "./YearGraphPerMonth";
import MonthlySpendingComponent from "./MonthlySpendingComponent";
import CategorizedMonthlySpendingComponent from "./CategorizedMonthlySpendingComponent";

import '../../assets/css/CategorieReportView.scss'

const CategoryReportView = () => {
    const [categories, setCategories]           = useState()
    const [range, setRange]                     = useState(Dates.Ranges.currentYear)
    const [currencySymbol, setCurrencySymbol]   = useState('')
    const {currency = 'EUR', year}              = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        CategoryRepository.all()
            .then(setCategories)
    }, [])
    useEffect(() => {
        if (year) setRange(Dates.Ranges.forYear(parseInt(year)))
    }, [year])
    useEffect(() => {
        CurrencyRepository.get(currency)
            .then(({symbol}) => setCurrencySymbol(symbol))
    }, [currency])

    const onDateChanged = ({newYear = year, newCurrency = currency}) => navigate(`/reports/monthly-category/${newYear}/${newCurrency}`)

    if (!categories) return <Loading />
    return (
        <div className='CategoryReport'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.title.reports.default' />
                <BreadCrumbItem label='page.reports.category.title' />
                <BreadCrumbItem message={`${range.year()}`} />
                <BreadCrumbItem message={currencySymbol} />
                <BreadCrumbMenu>
                    <Dropdown.Currency currency={currency} onChange={currency => onDateChanged({newCurrency: currency.code})} />
                    <Dropdown.Year year={range.year()} onChange={year => onDateChanged({newYear: year})}/>
                </BreadCrumbMenu>
            </BreadCrumbs>

            <div className='Columns'>
                <Layout.Card title='page.reports.category.title'>
                    <CategoryGraph categories={categories} range={range} currencySymbol={currencySymbol} />
                </Layout.Card>
                <Layout.Card title='page.reports.category.monthly'>
                    <MonthlySpendingComponent categories={categories} range={range}/>
                </Layout.Card>
            </div>

            <Layout.Card>
                <CategorizedMonthlySpendingComponent categories={categories} year={range.year()} />
            </Layout.Card>
        </div>
    )
}

export default CategoryReportView
