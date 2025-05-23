import React, { Context, createContext, FC, FormEvent, ReactNode, useEffect, useState } from "react";
import { AddFieldFunc, FieldType, FormContextType, OnValueChangeFunc } from "./form-types";

function validateField(field: FieldType) {
    const { value } = field;
    const errors = [];
    if (field.required && (value === undefined || value === null || value === '')) {
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
    onChange?: (_: any) => void,                 // A handler that will be called if any of the inputs changes
    style?: 'group' | 'default',
    children: ReactNode | ReactNode[]
}

/**
 * A form component adds a mutable form to the view for the user. This component supports validation and has a hook
 * to get notified when the form is submitted. This hook is only triggered when there are no validation failures in any
 * of the input components.
 */
export const Form: FC<FormProps> = ({ entity, onSubmit, onChange, style = 'group', children }) => {
    const [fields, setFields] = useState<Record<string, FieldType>>({})
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
        if (event.persist) event.persist()

        type FieldKey = keyof typeof fields
        const existingField = fields[id as FieldKey]
        const updatedValue = (event.currentTarget as HTMLInputElement).value
        const hasChanged = existingField.value !== updatedValue

        console.debug(`\tUpdating field %c${id}%c value to '%c${JSON.stringify((event.currentTarget as HTMLInputElement).value)}%c'.`, 'color: blue', '', 'color: purple', '')
        if (hasChanged) {
            onAddField({
                field: {
                    ...(fields[id as FieldKey] as FieldType),
                    touched: true,
                    value: (event.currentTarget as HTMLInputElement).value
                }
            })
        }
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

    // eslint-disable-next-line @eslint-react/no-unstable-context-value
    const formContext: FormContextType = {
        fields,
        errors,
        entity: entity,
        addField: onAddField,
        onChange: onValueChange,
        onInputBlur: ({ id }: { id: string }) => {
            if (onChange) {
                const entity: Record<string, any> = {}
                Object.entries(fields)
                    .forEach(([id, field]) => entity[id] = (field as FieldType).value)

                onChange({ changed: id, value: entity })
            }
        }
    }

    return (
        <form onSubmit={ onFormSubmit }
              className={ `${ style }` }
              noValidate={ true }
              autoComplete='off'
              autoCorrect="off"
              spellCheck="false"
              action="#">
            <FormContext value={ formContext }>
                { children }
            </FormContext>
        </form>
    )
}
