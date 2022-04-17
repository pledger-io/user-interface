import PropTypes from 'prop-types';

import {AbstractInput} from "./AbstractInput";

export class AmountInput extends AbstractInput {
    static propTypes = {
        ...AbstractInput.propTypes,
        // Indicator if the field is in read only mode
        readonly: PropTypes.bool,
        // Any minimum value validation
        min: PropTypes.number,
        // Any maximum value
        max: PropTypes.number,
        // The currency the amount is in
        currency: PropTypes.string
    }

    renderInput(field, fieldContext) {
        const {required, readonly, min = 0, max, onChange = value => {}, currency} = this.props
        const value = field.value || this.props.value || ''

        return (
            <div className='Appender'>
                <span className='Prepend'>{this.renderCurrencySymbol()}</span>
                <input id={field.id}
                       name={field.id}
                       value={field && value}
                       required={required}
                       min={min}
                       max={max}
                       readOnly={readonly}
                       onChange={e => fieldContext.onChange(e, field) && onChange(e.currentTarget.value)}
                       type='number' />
            </div>
        )
    }

    renderCurrencySymbol() {
        const {currency = null} = this.props
        if (currency === null) {
            return ''
        }

        const language = localStorage.getItem('language') || 'en';
        const formatter = new Intl.NumberFormat(language, {
            currency: currency,
            style: 'currency'
        })

        return formatter.formatToParts(0)
            .find(x => x.type === 'currency')
            ?.value
    }
}
