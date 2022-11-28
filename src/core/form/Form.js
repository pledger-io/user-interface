import React, {createContext, useMemo, useState} from "react";
import PropTypes from 'prop-types';

import '../../assets/css/Form.scss'

function validateField(field) {
    const {value} = field;
    let errors = [];
    if (field.required && !value) {
        errors.push('required')
    }

    if (field.pattern && value) {
        const pattern = new RegExp(field.pattern, '\i')
        if (!pattern.test(field.value)) {
            errors.push('pattern')
        }
    }

    if (field.hasOwnProperty('min') && value) {
        if (parseInt(value) < field.min) {
            errors.push('min')
        }
    }

    if (field.hasOwnProperty('validators')) {
        for (let idx = 0; idx < field.validators.length; idx++) {
            if (!field.validators[idx].validate(value)) {
                errors.push(field.validators[idx].label)
            }
        }
    }
    return errors;
}

/**
 * The form context allows for validating and updating field values.
 * @type {React.Context<{onChange: (function(*, *): undefined), addField: (function(*): undefined), fields: {}, errors: {}, entity: string}>}
 */
export const FormContext = createContext({
    /**
     * The fields that are attached to the form
     */
    fields: {},
    /**
     * The errors that are set for any of the attached fields
     */
    errors: {},
    entity: '',
    onChange: event => undefined,
    addField: field => undefined,
})


/**
 * A form component adds a mutable form to the view for the user. This component supports validation and has a hook
 * to get notified when the form is submitted. This hook is only triggered when there are no validation failures in any
 * of the input components.
 */
export const Form = ({entity, onSubmit, style = 'group', children}) => {
    const [fields, setFields] = useState({})
    const [errors, setErrors] = useState({})

    const onAddField =  ({field}) => {
        setFields(current => ({...current, [field.id]: field}))
        setErrors(current => ({...current, [field.id]: validateField(field)}))
    }
    const onValueChange = (event, {id}) => {
        event.persist()
        onAddField({
            field: {
                ...fields[id],
                touched: true,
                value: event.currentTarget.value
            }
        })
    }
    const onFormSubmit = event => {
        event.preventDefault()

        entity = {}
        Object.entries(fields)
            .forEach(([id, field]) => entity[id] = field.value)
        onSubmit(entity)
        return false;
    }

    const formContext = {
        fields,
        errors,
        entity: entity,
        addField: onAddField,
        onChange: onValueChange
    }

    return (
        <form onSubmit={onFormSubmit}
              className={`Form ${style}`}
              noValidate={true}
              autoComplete='off'
              action="#">
            <FormContext.Provider value={formContext}>
                {children}
            </FormContext.Provider>
        </form>
    )
}
Form.propTypes = {
    // The handler that will be called with the entity, where the entity is build up of all fields in the form.
    onSubmit: PropTypes.func.isRequired,
    // The entity type, used in error building
    entity: PropTypes.string.isRequired,
    style: PropTypes.oneOf(['group', 'default'])
}

