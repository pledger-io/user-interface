import React, { FC, ReactNode, useEffect, useState } from "react";
import LocalizationService from "../../../service/localization.service";

import { InputGroup, useInputField } from "./InputGroup";
import { FieldType } from "../form-types";

export type SelectInputProps = FieldType & {
    title?: string,
    help?: string,
    onChange?: (_: any) => void,
    className?: string,
    children?: ReactNode
}

/**
 * The select component allows for creating a dropdown where the user can pick one of multiple entries.
 */
export const SelectInput: FC<SelectInputProps> = (props) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })

    if (!field) return <>props.id</>
    return (
        <InputGroup id={ props.id }
                    required={ props.required }
                    title={ props.title }
                    help={ props.help }
                    className={ props.className }
                    valid={ field.touched ? errors.length === 0 : undefined }>

            <select id={ field.id }
                    name={ field.id }
                    value={ field.value }
                    required={ props.required }
                    onChange={ onChange }>
                <option disabled={ field.value }>-</option>
                { props.children }
            </select>
        </InputGroup>
    )
}


type SelectOptionProps = {
    message?: string,
    label?: string,
    value: string | number
}

/**
 * An option in a Select component. A `message` or `label` should be provided, but not both.
 */
export const SelectOption: FC<SelectOptionProps> = ({ message, value, label }) => {
    const [display, setDisplay] = useState('')

    useEffect(() => {
        if (label) LocalizationService.get(label).then(setDisplay)
    }, [label])
    useEffect(() => {
        if (message) setDisplay(message)
    }, [message])

    return <option value={ value }>{ display }</option>
}