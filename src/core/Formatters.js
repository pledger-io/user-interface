import PropTypes from 'prop-types';
import useLocalStorage from "../hooks/local-storage.hook";

/**
 * Formats a date in accordance with the format that corresponds with the locale of the user.
 * @param {string} date - The ISO date string
 */
const FormattedDate = ({ date }) => {
    const [language] = useLocalStorage('language', 'en');

    if (date) {
        const formatted = new Intl.DateTimeFormat(language).format(new Date(date))
        return (
            <span className='FormattedDate'>{formatted}</span>
        )
    }

    return <></>
}

const FormattedDateTime = ({ date }) => {
    const [language] = useLocalStorage('language', 'en');

    if (date) {
        const formatted = new Intl.DateTimeFormat(language, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(date))
        return (
            <span className='FormattedDate'>{ formatted }</span>
        )
    }

    return <></>
}


/**
 * Formats a decimal value as a money output with the currency prepended, pending on the locale.
 * @param {number} [money] - The money value to be formatted
 * @param {string} [currency] - The currency to display the money in
 */
const FormattedMoney = ({ money = 0.0, currency = sessionStorage.getItem('currency') || 'EUR' }) => {
    const [language]  = useLocalStorage('language', 'en');
    const className = 'Text ' + (money > 0 ? 'Green' : money < 0 ? 'Red' : '')
    const formatter = new Intl.NumberFormat(language, {
        currency: currency,
        style: 'currency'
    })

    return (
        <span data-testid="money" className={className}>{formatter.format(money)}</span>
    )
}

/**
 * Formats a decimal value ad a percentage, with by default 2 decimals.
 */
const FormattedPercentage = ({ percentage = 0, decimals = 2 }) => {
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
    FormattedDate as Date,
    FormattedDateTime as DateTime
}
