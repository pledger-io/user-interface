import React, {ChangeEventHandler, FC, ReactNode, useContext, useEffect} from "react";
import Translation from "../../localization/translation.component";
import HelpTranslation from "../../localization/help.component";

import { FormContext } from "../Form";
import {FieldType, FormContextType, InputBlurFunc, InputChangeFunc} from "../form-types";

type InputGroupProps = {
    id: string,                 // The identifier of the field in the entity
    help?: string,              // A text label used for the title of this input (the label)
    title?: string,             // A text label used for any addition help text for this input
    required?: boolean          // Indicator if the field is required,
    valid?: boolean,
    className?: string,
    inputClassName?: string
    children: ReactNode | ReactNode[]
}

export const InputGroup: FC<InputGroupProps> = ({ id, help, title, required = false, valid, className = '', inputClassName = '', children }) => {
    return <div
        className={ `Input mb-2 block md:flex ${ valid !== undefined ? (valid ? 'valid' : 'invalid') : '' } ${ className }` }>
        { title && (
            <label htmlFor={ id }
                   className={ `max-w-full md-max-w-[15vw] inline-flex items-center ${ required ? 'font-bold' : '' }` }>
                <Translation label={ title }/>
                { help ? <HelpTranslation label={ help } className='font-normal text-end pr-1'/> : '' }
            </label>
        ) }
        <div className={`px-1 md:px-0 md:flex-1 ${ inputClassName }`}>{ children }</div>
    </div>
}

type useInputFieldProps = {
    field: any,
    onChange?: (_: string) => void,
}
export const useInputField = ({ onChange, field }: useInputFieldProps) : [FieldType, string[], InputChangeFunc<any>, InputBlurFunc] => {
    const formContext = useContext(FormContext) as FormContextType

    useEffect(() => {
        if (!formContext.fields[field.id]) {
            console.info(`\tRegister form field %c${field.id}%c.`, 'color: blue', '')
            formContext.addField({
                field: field,
                value: field.value || ''
            })
        }
    }, [field.id])
    useEffect(() => {
        if (formContext.fields[field.id] && !formContext.fields[field.id].touched)
            if (field.value) console.debug(`\tUpdating field %c${field.id}%c value to '%c${JSON.stringify(field.value)}%c'.`, 'color: blue', '', 'color: purple', '')
            formContext.addField({
                field: {
                    ...formContext.fields[field.id],
                    value: field.value || ''
                }
            })
    }, [field.value])

    const onChangedEvent: ChangeEventHandler = event => {
        formContext.onChange(event, formContext.fields[field.id])
        if (onChange) onChange((event.currentTarget as HTMLInputElement).value)
    }
    const onInputBlur = () => {
        formContext.onInputBlur({ id: field.id })
    }

    return [
        formContext.fields[field.id],
        formContext.errors[field.id] || [],
        onChangedEvent,
        onInputBlur,
    ]
}

type InputValidationErrorsProps = {
    errors: string[],
    field: any
}

/**
 * For rendering any input validation failures.
 */
export const InputValidationErrors: FC<InputValidationErrorsProps> = ({ errors, field }) => {
    const formContext = useContext(FormContext)

    return <>
        { errors.map((error: string, idx: number) =>
            <span className='validation' key={idx}>
                <Translation key={idx} label={`${formContext.entity}.${field.id}.${error}`}/>
            </span>) }
    </>
}
