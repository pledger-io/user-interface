import React from "react"
import PropTypes from 'prop-types'

import * as Buttons from "./Button"

import '../assets/css/Dropdown.scss'
import {mdiMenuDown} from "@mdi/js";
import DatePicker from "react-datepicker";
import restAPI from "./RestAPI";

class Service {
    currencies = []

    getCurrencies() {
        if (this.currencies.length === 0) {
            restAPI.get('settings/currencies')
                .then(response => this.currencies = response)
        }

        return this.currencies
    }
}

const service = new Service()

class Dropdown extends React.Component {
    static stateProps = {
        // The actions that can be triggered, has one function called close() on it
        actions: PropTypes.object,
        // The icon to be used
        icon: PropTypes.object
    }

    state = {
        open: false
    }

    constructor(props, context) {
        super(props, context);

        const {actions} = this.props
        if (actions) {
            actions.close = () => this.close();
        }
    }

    render() {
        const {open} = this.state
        const {icon, children} = this.props

        return (
            <div className='Dropdown'>
                <Buttons.Button variant='icon' className='muted' icon={icon} onClick={this.toggle.bind(this)}/>
                <div className={`Expanded ${open}`} onClick={() => this.close()}>{children}</div>
            </div>
        )
    }

    toggle() {
        this.setState({
            open: !this.state.open
        })
    }

    close() {
        this.setState({
            open: false
        })
    }

    open() {
        this.setState({
            open: true
        })
    }
}

class CurrencyDropdown extends React.Component {

    state = {
        currencyOpen: false
    }

    constructor(props, context) {
        super(props, context);
        service.getCurrencies()
    }

    render() {
        const {currency} = this.props
        const {currencyOpen} = this.state

        return (
            <div className="CurrencyDropdown">
                <Buttons.Button variant='text'
                                onClick={this.open.bind(this)}
                                icon={mdiMenuDown}
                                iconPos={'after'}
                                message={currency} />

                <div className='Expanded'>
                    {currencyOpen && (
                        service.getCurrencies()
                            .map(currency =>
                                <Buttons.Button message={`${currency.name} (${currency.symbol})`}
                                                onClick={() => this.currencySelected(currency)}
                                                key={currency.code}
                                                variant='primary'
                                                variantType='outline' />)
                    )}
                </div>
            </div>
        )
    }

    currencySelected(currency) {
        const {onChange = changed => {}} = this.props

        onChange(currency)
        this.setState({
            currencyOpen: false
        })
    }

    open() {
        const {currencyOpen} = this.state
        this.setState({
            currencyOpen: !currencyOpen
        })
    }
}

class YearDropdown extends React.Component {
    static propTypes = {
        year: PropTypes.number,
        onChange: PropTypes.func.isRequired
    }

    state = {
        yearOpen: false
    }

    render() {
        const {year = 1970} = this.props
        const {yearOpen} = this.state
        const selectedDate = new Date(year, 0, 1)

        return (
            <div className='YearDropdown'>
                <Buttons.Button variant='text'
                                onClick={this.openYearDropdown.bind(this)}
                                icon={mdiMenuDown}
                                iconPos={'after'}
                                message={'' + year} />

                <div className='Expanded'>
                    {yearOpen && (<DatePicker showYearPicker
                                              dateFormat='yyyy'
                                              inline
                                              selected={selectedDate}
                                              onChange={this.yearSelected.bind(this)}/>)}
                </div>
            </div>
        )
    }

    openYearDropdown() {
        const {yearOpen} = this.state
        this.setState({
            yearOpen: !yearOpen
        })
    }

    yearSelected(date) {
        const {onChange} = this.props

        this.setState({
            yearOpen: false,
            monthOpen: false
        })
        onChange(date.getFullYear())
    }
}

class MonthYearDropdown extends React.Component {
    static propTypes = {
        selected: PropTypes.shape({
            month: PropTypes.number,
            year: PropTypes.number
        }),
        onChange: PropTypes.func.isRequired
    }

    state = {
        yearOpen: false,
        monthOpen: false
    }

    render() {
        const {selected: {month = 1, year = 1970}} = this.props
        const {yearOpen, monthOpen} = this.state
        const selectedDate = new Date(year, month - 1, 1)

        return (
            <div className='YearMonthDropdown'>
                <Buttons.Button variant='text'
                                onClick={this.openMonthDropdown.bind(this)}
                                icon={mdiMenuDown}
                                iconPos={'after'}
                                label={`common.month.${month}`} />
                <Buttons.Button variant='text'
                                onClick={this.openYearDropdown.bind(this)}
                                icon={mdiMenuDown}
                                iconPos={'after'}
                                message={'' + year} />

                <div className='Expanded'>
                    {yearOpen && (<DatePicker showYearPicker
                                              dateFormat='yyyy'
                                              inline
                                              selected={selectedDate}
                                              onChange={this.yearSelected.bind(this)}/>)}
                    {monthOpen && (<DatePicker showMonthYearPicker
                                               dateFormat='MM'
                                               selected={selectedDate}
                                               onChange={this.monthSelected.bind(this)}
                                               inline />)}
                </div>
            </div>
        )
    }

    yearSelected(date) {
        const {onChange, selected: {month = 1}} = this.props

        this.setState({
            yearOpen: false,
            monthOpen: false
        })
        onChange({year: date.getFullYear(), month: month})
    }

    monthSelected(date) {
        const {onChange, selected: {year = 1970}} = this.props

        this.setState({
            yearOpen: false,
            monthOpen: false
        })
        onChange({year: year, month: date.getMonth() + 1})
    }

    openYearDropdown() {
        const {yearOpen} = this.state
        this.setState({
            yearOpen: !yearOpen,
            monthOpen: false
        })
    }

    openMonthDropdown() {
        const {monthOpen} = this.state
        this.setState({
            monthOpen: !monthOpen,
            yearOpen: false
        })
    }
}

export {
    Dropdown,
    MonthYearDropdown as YearMonth,
    YearDropdown as Year,
    CurrencyDropdown as Currency
}
