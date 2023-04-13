import React, {useContext, useRef} from "react";
import PropTypes from 'prop-types';

import {HelpTranslation, Translation} from "../../Translation";
import {FormContext} from "../Form";

export const InputGroup = ({id, help, title, required = false, valid, children}) => {
    const className = `Input ${required ? 'Required ' : ''}` +
        (valid !== undefined ? (valid ? 'valid' : 'invalid') : '')

    return (
        <div className={className}>
            {title && (
                <label htmlFor={id}>
                    <Translation label={title}/>
                    {help ? <HelpTranslation label={help}/> : ''}
                </label>
            )}
            <div>{children}</div>
        </div>
    )
}
InputGroup.propTypes = {
    // The identifier of the field in the entity
    id: PropTypes.string.isRequired,
    // A text label used for the title of this input (the label)
    title: PropTypes.string,
    // A text label used for any addition help text for this input
    help: PropTypes.string,
    // Indicator if the field is required
    required: PropTypes.bool,
}

export const useInputField = ({onChange, field}) => {
    const formContext = useRef(useContext(FormContext))
    const onChangedEvent = event => {
        formContext.current.onChange(event, formContext.current.fields[field.id])
        if (onChange) onChange(event.currentTarget.value)
    }

    if (!formContext.current.fields.hasOwnProperty(field.id)) {
        formContext.current.addField({
            field: field,
            value: field.value || ''
        })
    }

    return [
        formContext.current.fields[field.id],
        formContext.current.errors[field.id] || [],
        onChangedEvent
    ]
}

/**
 * For rendering any input validation failures.
 */
export const InputValidationErrors = ({errors, field}) => {
    const formContext = useContext(FormContext)
    return (
        errors.map((error, idx) => (
            <span className='validation' key={idx}>
                <Translation key={idx} label={`${formContext.entity}.${field.id}.${error}`}/>
            </span>
        ))
    )
}
InputValidationErrors.propTypes = {
    // The validation errors
    errors: PropTypes.array,
    // The field the errors are on
    field: PropTypes.object
}
