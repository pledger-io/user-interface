import React from "react";
import PropTypes from 'prop-types';

class FormattedDate extends React.Component {
    static propTypes = {
        // The ISO date string
        date: PropTypes.string
    }
    render() {
        const {date} = this.props;
        const language = localStorage.getItem('language') || 'en';

        if (date) {
            const formattedDate = new Intl.DateTimeFormat(language).format(new Date(date));
            return (
                <span className='FormattedDate'>
                {formattedDate}
                </span>
            )
        }

        return ''
    }
}

class FormattedMoney extends React.Component {
    static propTypes = {
        // The actual money value
        money: PropTypes.number,
        // The currency to display the money in
        currency: PropTypes.string
    }
    render() {
        let {money = null, currency = sessionStorage.getItem('currency') || 'EUR'} = this.props;
        const language = localStorage.getItem('language') || 'en';
        const formatter = new Intl.NumberFormat(language, {
            currency: currency,
            style: 'currency'
        })
        const className = 'Text ' + (money > 0 ? 'Green' : money < 0 ? 'Red' : '')

        if (money == null) {
            return ''
        }

        return (
            <span className={className}>
                {formatter.format(money)}
            </span>
        )
    }
}

class FormattedPercentage extends React.Component {
    static propTypes = {
        // The value to be formatted
        percentage: PropTypes.number,
        // The number of decimals to format the value with
        decimals: PropTypes.number
    }
    render() {
        let {percentage = null, decimals = 2} = this.props
        const language = localStorage.getItem('language') || 'en';
        const formatter = new Intl.NumberFormat(language, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })

        if (percentage == null) {
            return ''
        }

        return (
            <span className='Percentage'>
                {formatter.format(percentage * 100)}%
            </span>
        )
    }
}

export {
    FormattedPercentage as Percent,
    FormattedMoney as Money,
    FormattedDate as Date
}
