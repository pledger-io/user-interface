import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import {InputGroup, useInputField} from "./InputGroup";
import {LocalizationService} from "../../Translation";

/**
 * The select component allows for creating a dropdown where the user can pick one of multiple entries.
 */
export const SelectInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>

            <select id={field.id}
                    name={field.id}
                    value={field.value}
                    required={props.required}
                    onChange={onChange}>
                <option disabled></option>
                {props.children}
            </select>
        </InputGroup>
    )
}
SelectInput.propTypes = {
    ...InputGroup.propTypes,
    // The current value for the select
    value: PropTypes.any
}

/**
 * An option in a Select component. A `message` or `label` should be provided, but not both.
 */
export const SelectOption = ({message, value, label}) => {
    const [display, setDisplay] = useState('')

    useEffect(() => {
        if (label) LocalizationService.get(label).then(setDisplay)
    }, [label])
    useEffect(() => {
        if (message) setDisplay(message)
    }, [message])

    return <option value={value}>{display}</option>
}
SelectOption.propTypes = {
    // The message that should be displayed in the dropdown option
    message: PropTypes.string,
    // The label for a translated message in the dropdown option
    label: PropTypes.string,
    // The value of the option in the dropdown
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
