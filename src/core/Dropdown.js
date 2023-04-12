import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'

import * as Buttons from "./buttons"

import '../assets/css/Dropdown.scss'
import {mdiMenuDown} from "@mdi/js";
import DatePicker from "react-datepicker";
import {CurrencyRepository} from "./RestAPI";

const Dropdown = ({actions, title, icon, children}) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (actions) actions.close = () => setOpen(false)
    }, [actions])

    const variant = title ? 'primary' : 'icon'
    return (
        <div className={`Dropdown ${variant}`}>
            <Buttons.Button variant={variant} label={title} className='muted' icon={icon} iconPos='after' onClick={() => setOpen(!open)}/>
            <div className={`Expanded ${open}`} onClick={() => setOpen(false)}>{children}</div>
        </div>
    )
}
Dropdown.propTypes = {
    // The actions that can be triggered, has one function called close() on it
    actions: PropTypes.object,
    // The icon to be used
    icon: PropTypes.string,
    title: PropTypes.string
}

const CurrencyDropdown = ({currency, onChange = (currency) => undefined}) => {
    const [currencyOpen, setCurrencyOpen] = useState(false)
    const [currencies, setCurrencies]     = useState([])

    const onSelect = selected => onChange(selected) || setCurrencyOpen(false)

    useEffect(() => {
        CurrencyRepository.list()
            .then(setCurrencies)
    }, [])

    return (
        <div className="CurrencyDropdown">
            <Buttons.Button variant='text'
                            onClick={() => setCurrencyOpen(true)}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={currency} />

            <div className='Expanded'>
                {currencyOpen && (
                    currencies
                        .map(currency =>
                            <Buttons.Button message={`${currency.name} (${currency.symbol})`}
                                            onClick={() => onSelect(currency)}
                                            key={currency.code}
                                            variant='primary'
                                            variantType='outline' />)
                )}
            </div>
        </div>
    )
}
CurrencyDropdown.propTypes = {
    // The currently selected currency
    currency: PropTypes.string,
    // The callback used when a currency is selected
    onChange: PropTypes.func
}


const YearDropdown = ({year = 1970, onChange = year => undefined}) => {
    const [yearOpen, setYearOpen] = useState(false)
    const onSelect = date => setYearOpen(false) || onChange(date.getFullYear())

    return (
        <div className='YearDropdown'>
            <Buttons.Button variant='text'
                            onClick={() => setYearOpen(true)}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={'' + year} />

            <div className='Expanded'>
                {yearOpen && (<DatePicker showYearPicker
                                          dateFormat='yyyy'
                                          inline
                                          selected={new Date(year, 0, 1)}
                                          onChange={date => onSelect(date)}/>)}
            </div>
        </div>
    )
}
YearDropdown.propTypes = {
    // The preselected year of the dropdown
    year: PropTypes.number,
    // The callback used when a new year is selected
    onChange: PropTypes.func.isRequired
}


const MonthYearDropdown = ({selected: {year, month}, onChange}) => {
    const [yearOpen, setYearOpen]   = useState(false)
    const [monthOpen, setMonthOpen] = useState(false)

    const closeBoth     = ()    => setYearOpen(false) || setMonthOpen(false)
    const onYearSelect  = date  => closeBoth() || onChange({year: date.getFullYear(), month: month})
    const onMonthSelect = date  => closeBoth() || onChange({year: date.getFullYear(), month: date.getMonth() + 1})
    const onOpenMonth   = ()    => closeBoth() || setMonthOpen(!monthOpen)
    const onOpenYear    = ()    => closeBoth() || setYearOpen(!yearOpen)

    const selectedDate = new Date(year, month - 1, 1)

    return (
        <div className='YearMonthDropdown'>
            <Buttons.Button variant='text'
                            onClick={onOpenMonth}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            label={`common.month.${month}`} />
            <Buttons.Button variant='text'
                            onClick={onOpenYear}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={'' + year} />

            <div className='Expanded'>
                {yearOpen && (<DatePicker showYearPicker
                                          dateFormat='yyyy'
                                          inline
                                          selected={selectedDate}
                                          onChange={onYearSelect}/>)}
                {monthOpen && (<DatePicker showMonthYearPicker
                                           dateFormat='MM'
                                           selected={selectedDate}
                                           onChange={onMonthSelect}
                                           inline />)}
            </div>
        </div>
    )
}
MonthYearDropdown.propTypes = {
    selected: PropTypes.shape({
        month: PropTypes.number,
        year: PropTypes.number
    }),
    onChange: PropTypes.func.isRequired
}

export {
    Dropdown,
    MonthYearDropdown as YearMonth,
    YearDropdown as Year,
    CurrencyDropdown as Currency
}
