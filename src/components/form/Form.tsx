import React, { Context, createContext, FC, FormEvent, ReactNode, useEffect, useState } from "react";
import { AddFieldFunc, FieldType, FormContextType, OnValueChangeFunc } from "./form-types";

import '../../assets/css/Form.scss'

function validateField(field: FieldType) {
    const { value } = field;
    const errors = [];
    if (field.required && !value) {
        errors.push('required')
    }

    if (field.pattern && value) {
        const pattern = new RegExp(field.pattern)
        if (!pattern.test(field.value)) {
            errors.push('pattern')
        }
    }

    if (field.min !== undefined && value) {
        if (parseInt(value) < field.min) {
            errors.push('min')
        }
    }

    if (field.validators) {
        for (let idx = 0; idx < field.validators.length; idx++) {
            if (!field.validators[idx].validate(value)) {
                errors.push(field?.validators[idx].label)
            }
        }
    }
    return errors;
}

/**
 * The form context allows for validating and updating field values.
 * @type {React.Context<{onChange: (function(*, *): undefined), addField: (function(*): undefined), fields: {}, errors: {}, entity: string}>}
 */
export const FormContext: Context<FormContextType> = createContext({} as FormContextType)

type FormProps = {
    entity: string,                             // The entity type, used in error building
    onSubmit: (_: any) => void,                 // The handler that will be called with the entity, where the entity is build up of all fields in the form.
    style?: 'group' | 'default',
    children: ReactNode | ReactNode[]
}

/**
 * A form component adds a mutable form to the view for the user. This component supports validation and has a hook
 * to get notified when the form is submitted. This hook is only triggered when there are no validation failures in any
 * of the input components.
 */
export const Form: FC<FormProps> = ({ entity, onSubmit, style = 'group', children }) => {
    const [fields, setFields] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        console.info(`Rendering form %c${entity}%c.`, 'color: red', '')
        return () => {
            console.info(`Destroying form %c${entity}%c.`, 'color: red', '')
        }
    }, [entity])

    const onAddField: AddFieldFunc =  ({ field }) => {
        setFields(current => ({ ...current, [field.id]: field }))
        setErrors(current => ({ ...current, [field.id]: validateField(field) }))
    }
    const onValueChange: OnValueChangeFunc = (event, { id }) => {
        event.persist()

        type FieldKey = keyof typeof fields
        onAddField({
            field: {
                ...(fields[id as FieldKey] as FieldType),
                touched: true,
                value: (event.currentTarget as HTMLInputElement).value
            }
        })
    }
    const onFormSubmit = (event: FormEvent) => {
        console.info('Handling the form submit.')
        event.preventDefault()
        const entity: Record<string, any> = {}
        Object.entries(fields)
            .forEach(([id, field]) => entity[id] = (field as FieldType).value)
        onSubmit(entity)
        return false;
    }

    const formContext = {
        fields,
        errors,
        entity: entity,
        addField: onAddField,
        onChange: onValueChange
    } as FormContextType

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


