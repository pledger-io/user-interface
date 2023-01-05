import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import DatePicker from "react-datepicker";
import {InputGroup, InputValidationErrors, useInputField} from "./InputGroup";

import 'react-datepicker/dist/react-datepicker.css';

const DateFormats = {
    nl: 'dd-MM-yyyy',
    en: 'MM/dd/yyyy',
    de: 'dd.MM.yyyy'
}

/**
 * A date selection component for forms.
 */
const DateInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})
    const [selected, setSelected]   = useState(new Date())

    const onDateChanged = date => {
        const isoDate = date.toISOString().substring(0, 10)
        setSelected(date)
        onChange({
            persist: () => {},
            currentTarget: {value: isoDate}
        })
    }

    useEffect(() => {
        if (props.value) setSelected(new Date(props.value))
    }, [props.value])

    if (!field) return ""
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <DatePicker required={props.required}
                        selected={selected}
                        readOnly={props.readonly}
                        dateFormat={DateFormats[localStorage.getItem('language')]}
                        onChange={onDateChanged}/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}
DateInput.propTypes = {
    ...InputGroup.propTypes,
    // Indicator if the field is in read only mode
    readonly: PropTypes.bool
}

export default DateInput
