import PropTypes from 'prop-types';
import {useLocalStorage} from "./hooks";

/**
 * Formats a date in accordance with the format that corresponds with the locale of the user.
 */
const FormattedDate = ({date}) => {
    const [language] = useLocalStorage('language', 'en');
    const formatted = new Intl.DateTimeFormat(language).format(new Date(date))

    if (date) {
        return (
            <span className='FormattedDate'>{formatted}</span>
        )
    }

    return ''
}
FormattedDate.propTypes = {
    // The ISO date string
    date: PropTypes.string
}


/**
 * Formats a decimal value as a money output with the currency prepended, pending on the locale.
 */
const FormattedMoney = ({money = 0.0, currency = sessionStorage.getItem('currency') || 'EUR'}) => {
    const [language]  = useLocalStorage('language', 'en');
    const className = 'Text ' + (money > 0 ? 'Green' : money < 0 ? 'Red' : '')
    const formatter = new Intl.NumberFormat(language, {
        currency: currency,
        style: 'currency'
    })

    return (
        <span role='money' className={className}>{formatter.format(money)}</span>
    )
}
FormattedMoney.propTypes = {
    // The actual money value
    money: PropTypes.number,
    // The currency to display the money in
    currency: PropTypes.string
}


/**
 * Formats a decimal value ad a percentage, with by default 2 decimals.
 */
const FormattedPercentage = ({percentage = 0, decimals = 2}) => {
    const [language] = useLocalStorage('language', 'en');
    const formatter = new Intl.NumberFormat(language, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })

    return <span className='Percentage'>{formatter.format(percentage * 100)}%</span>
}
FormattedPercentage.propTypes = {
    // The value to be formatted
    percentage: PropTypes.number,
    // The number of decimals to format the value with
    decimals: PropTypes.number
}


export {
    FormattedPercentage as Percent,
    FormattedMoney as Money,
    FormattedDate as Date
}
