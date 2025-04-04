import { InputValidationErrors, useInputField } from "./InputGroup";
import { i10n } from "../../../config/prime-locale.js";
import React from "react";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { FieldType } from "../form-types";

type AmountInputProps = FieldType & {
    title?: string,
    help?: string,
    minLength?: number
    maxLength?: number,
    pattern?: string,
    readonly?: boolean,
    onChange?: (_: any) => void,
    className?: string,
    currency?: string
}

export const AmountInput = (props: AmountInputProps) => {
    const [field, errors, onChange, onBlur] = useInputField({ onChange: props.onChange, field: props })

    const handleChangeEvent = (e: InputNumberChangeEvent) => {
        onChange({
            currentTarget: {
                value: e.value
            }
        })
    }

    if (!field) return props.id
    return <>
        <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
            <label htmlFor={props.id} className='font-bold' data-testid={ `${ props.id }-label` }>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>
            <InputNumber id={ props.id }
                         maxFractionDigits={ 2 }
                         value={ field.value || props.value }
                         allowEmpty={ !props.required }
                         readOnly={ props.readonly }
                         disabled={ props.readonly }
                         invalid={ field.touched ? errors.length > 0 : undefined }
                         onBlur={ onBlur }
                         mode='currency'
                         data-testid={ `${ props.id }-input` }
                         currency={ props.currency || 'EUR' }
                         onChange={ handleChangeEvent }/>
        </div>

        { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </>
}

