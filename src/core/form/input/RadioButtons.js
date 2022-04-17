import React from "react";
import PropTypes from 'prop-types';

import {Translation} from "../../Translation";
import {FormContext} from "../Form";

export class RadioButtons extends React.Component {
    static contextType = FormContext
    static propTypes = {
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

    constructor(props, context) {
        super(props, context);

        this.context.addField({
            field: props,
            value: props.value || ''
        })
    }

    render() {
        const {id, options, onChange = value => {}} = this.props
        const field = this.context.fields[id]

        const changeHandler = option => {
            this.context.onChange({persist: () => {}, currentTarget: {value: option.value}}, field)
            onChange(option.value)
        }

        const buttons = (options || []).map(option => (
            <label key={option.value}
                   htmlFor={`option-${option.value}`}
                   onClick={() => changeHandler(option)}
                   className={`${option.variant} ${field?.value === option.value ? 'selected' : ''}`}>
                <input type='radio'
                       value={option.value}
                       name={`option-${option.value}`}/>
                <Translation label={option.label}/>
            </label>
        ))

        return (
            <div className='RadioButton'>
                {buttons}
            </div>
        )
    }
}

