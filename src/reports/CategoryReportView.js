import React, {useEffect, useState} from "react";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Dates,
    Dropdown,
    Loading,
    Statistical,
    Translations
} from "../core";
import {CategoryRepository, CurrencyRepository} from "../core/RestAPI";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "../core/index"

import '../assets/css/CategorieReportView.scss'
import {Chart} from "../core/Chart";

export const CategoryReportView = () => {
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
                <Card title='page.reports.category.title'>
                    <CategoryGraph categories={categories} range={range} currencySymbol={currencySymbol} />
                </Card>
                <Card title='page.reports.category.monthly'>
                    <CategoryMonthly categories={categories} range={range}/>
                </Card>
            </div>

            <Card>
                <CategoryPerMonth categories={categories} year={range.year()} />
            </Card>
        </div>
    )
}

const CategoryGraph = ({categories, range, currencySymbol}) => {
    const [incomeSeries, setIncomeSeries]   = useState(undefined)
    const [expenseSeries, setExpenseSeries] = useState(undefined)
    const [monthLabels, setMonthLabels]     = useState([])
    const [currentRange, setCurrentRange]   = useState()

    useEffect(() => {
        if (!range || !categories) return
        if (currentRange === range.start) return

        const months = [...new Array(12).keys()]
            .map(x => x + 1)
            .map(month => Dates.Ranges.forMonth(range.year(), month))

        setCurrentRange(range.start)
        setMonthLabels(months.map(month => month.start))

        Promise.all(months.map(m => Statistical.Service.balance({
            dateRange: m,
            onlyIncome: true,
            categories: categories})))
            .then(async responses => {
                return {
                    label: await Translations.LocalizationService.get('graph.series.income'),
                    backgroundColor: '#7fc6a5',
                    data: responses.map(({balance}) => balance)
                }
            })
            .then(setIncomeSeries)
        Promise.all(months.map(m => Statistical.Service.balance({
            dateRange: m,
            onlyIncome: false,
            categories: categories})))
            .then(async responses => {
                return {
                    label: await Translations.LocalizationService.get('graph.series.expenses'),
                    backgroundColor: '#dc3545',
                    data: responses.map(({balance}) => balance)
                }
            })
            .then(setExpenseSeries)
    }, [categories, range, currentRange])

    if (!incomeSeries || !expenseSeries) return <Loading />
    return (
        <Chart height={110}
               id='category-monthly'
               type='bar'
               labels={monthLabels}
               dataSets={[incomeSeries, expenseSeries]}
               options={{
                   scales: {
                       x: {
                           type: 'time',
                           time: {
                               unit: 'month'
                           }
                       },
                       y: {
                           ticks: {
                               callback: value => `${currencySymbol}${value}`
                           }
                       }
                   }
               }}/>
    )
}

const CategoryMonthly = ({categories, range}) => {

    if (!categories || !range) return <Loading />
    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='common.month' /></th>
                <th><Translations.Translation label='page.reports.category.income' /></th>
                <th><Translations.Translation label='page.reports.category.expense' /></th>
            </tr>
            </thead>
            <tbody>
            {[...new Array(12).keys()]
                .map(month => <tr key={month}>
                    <td><Translations.Translation label={`common.month.${month + 1}`} /></td>
                    <td><Statistical.Balance income={true}
                                             categories={categories}
                                             range={Dates.Ranges.forMonth(range.year(), month + 1)}/></td>
                    <td><Statistical.Balance income={false}
                                             categories={categories}
                                             range={Dates.Ranges.forMonth(range.year(), month + 1)}/></td>
                </tr>)}
            </tbody>
        </table>
    )
}

const CategoryPerMonth = ({categories, year}) => {
    const months = [...new Array(12).keys()]
        .map(month => Dates.Ranges.forMonth(year, month + 1))

    return (
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Category.label'/></th>
                {months.map(month => <th key={month.month()}><Translations.Translation label={`common.month.${month.month()}`}/></th>)}
            </tr>
            </thead>
            <tbody>
            {categories.map(category => (
                <tr>
                    <td>{category.label}</td>
                    {months.map(month => <td key={month.month()}>
                        <Statistical.Balance income={false} categories={[category]} range={month}/>
                    </td>)}
                </tr>
            ))}
            </tbody>
        </table>
    )
}
