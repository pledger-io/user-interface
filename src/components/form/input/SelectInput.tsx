import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import React, { FC, useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import LocalizationService from "../../../service/localization.service";
import { FieldType } from "../form-types";

import { useInputField } from "./InputGroup";

export type SelectInputProps = FieldType & {
    title?: string,
    help?: string,
    onChange?: (_: any) => void,
    className?: string,
    options: SelectOptionProps[]
}

export type SelectOptionProps = {
    message?: string,
    label?: string,
    value: string | number
}

const displayTemplate = (item: SelectOptionProps) => <>
    { item && (item.label ? i10n(item.label) : item.message) }
    { !item && <>&nbps;</> }
</>

/**
 * The select component allows for creating a dropdown where the user can pick one of multiple entries.
 */
export const SelectInput: FC<SelectInputProps> = (props) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })

    const handleChangeEvent = (e: DropdownChangeEvent) => {
        console.log(e)
        onChange({
            currentTarget: {
                value: e.value
            }
        })
    }

    if (!field) return <>props.id</>
    return <>
        <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
            <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>
            <Dropdown id={ props.id }
                      name={ props.id }
                      value={ field.value || props.value }
                      options={ props.options }
                      onChange={ handleChangeEvent }
                      required={ props.required }
                      valueTemplate={ displayTemplate }
                      itemTemplate={ displayTemplate }
                      invalid={ field.touched ? errors.length > 0 : undefined }/>
        </div>
    </>
}

/**
 * An option in a Select component. A `message` or `label` should be provided, but not both.
 * @deprecated
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
