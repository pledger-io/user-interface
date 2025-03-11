import {InputGroup, InputValidationErrors, useInputField} from "./InputGroup";
import {i10n} from "../../../config/prime-locale.js";
import {InputText} from "primereact/inputtext";
import React, {ChangeEvent} from "react";
import {InputNumber, InputNumberChangeEvent, InputNumberProps} from "primereact/inputnumber";
import {FieldType, InputChangeFunc} from "../form-types";

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
        <div className="flex flex-col gap-2 mt-2">
            <label htmlFor={props.id} className='font-bold'>{ i10n(props.title as string) }</label>
            <InputNumber id={ props.id }
                         maxFractionDigits={ 2 }
                         value={ field.value || props.value }
                         allowEmpty={ !props.required }
                         readOnly={ props.readonly }
                         invalid={ field.touched ? errors.length > 0 : undefined }
                         onBlur={ onBlur }
                         mode='currency'
                         currency={ props.currency || 'EUR' }
                         onChange={ handleChangeEvent }/>
        </div>

        { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </>
}

