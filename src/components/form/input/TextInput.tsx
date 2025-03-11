import React, { FC } from "react";
import { InputValidationErrors, useInputField } from "./InputGroup";
import { FieldType } from "../form-types";
import {InputText} from "primereact/inputtext";
import {i10n} from "../../../config/prime-locale";

type TextInputProps = FieldType & {
    type: 'number' | 'text' | 'password',
    autocomplete?: string,
    title?: string,
    help?: string,
    minLength?: number
    maxLength?: number,
    pattern?: string,
    readonly?: boolean,
    onChange?: (_: any) => void,
    className?: string
}

export const TextInput: FC<TextInputProps> = (props) => {
    const [field, errors, onChange, onBlur] = useInputField({ onChange: props.onChange, field: props })

    if (!field) return <>props.id</>
    return <>
        <div className="flex flex-col gap-2 mt-2">
            <label htmlFor={props.id} className='font-bold'>{i10n(props.title as string)}</label>
            <InputText id={props.id}
                       type={props.type}
                       onBlur={onBlur}
                       defaultValue={field.value || props.value}
                       autoComplete={props.autocomplete}
                       required={props.required}
                       pattern={props.pattern}
                       readOnly={props.readonly}
                       minLength={props.minLength}
                       maxLength={props.maxLength}
                       data-testid={`${props.id}-input`}
                       invalid={ field.touched ? errors.length > 0 : undefined }
                       onChange={onChange}/>
        </div>

        {field.touched && <InputValidationErrors field={field} errors={errors}/>}
    </>
}
