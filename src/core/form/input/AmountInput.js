import PropTypes from 'prop-types';

import {InputGroup, useInputField} from "./AbstractInput";
import {useEffect} from "react";

export const AmountInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})
    const language = localStorage.getItem('language') || 'en';
    const formatter = new Intl.NumberFormat(language, {
        currency: props.currency || 'EUR',
        style: 'currency'
    })

    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <div className='Appender'>
                <span className='Prepend'>
                    {formatter.formatToParts(0)
                        .find(x => x.type === 'currency')
                        ?.value}
                </span>
                <input id={field.id}
                       name={field.id}
                       value={field.value}
                       required={props.required}
                       min={props.min}
                       max={props.max}
                       readOnly={props.readonly}
                       onChange={onChange}
                       type='number' />
            </div>
        </InputGroup>
    )
}
AmountInput.propTypes = {
    ...InputGroup.propTypes,
    // Indicator if the field is in read only mode
    readonly: PropTypes.bool,
    // Any minimum value validation
    min: PropTypes.number,
    // Any maximum value
    max: PropTypes.number,
    // The currency the amount is in
    currency: PropTypes.string
}
