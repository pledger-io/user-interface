import React from "react";
import PropTypes from 'prop-types';

import {Translation} from "../../Translation";
import {useInputField} from "./InputGroup";

export const RadioButtons = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    return (
        <div className='RadioButton'>
            {props.options.map(option => (
                <label key={option.value}
                       htmlFor={`option-${option.value}`}
                       onClick={() => onChange({persist: () => {}, currentTarget: {value: option.value}})}
                       className={`${option.variant} ${field?.value === option.value ? 'selected' : ''}`}>
                    <input type='radio'
                           value={option.value}
                           name={`option-${option.value}`}/>
                    <Translation label={option.label}/>
                </label>
            ))}
        </div>
    )
}
RadioButtons.propTypes = {
    // The value of the input field
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        variant: PropTypes.oneOf(['primary', 'secondary', 'warning', 'success'])
    })),
    // The identifier of the field in the entity
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func
}


