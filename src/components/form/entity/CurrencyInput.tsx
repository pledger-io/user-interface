import React, { FC, useEffect, useState } from "react";
import restApi from "../../../core/repositories/rest-api";
import { Currency } from "../../../types/types";

import { SelectInputProps } from "../input/SelectInput";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useInputField } from "../input/InputGroup";
import { i10n } from "../../../config/prime-locale";

type CurrencyInputProps = Omit<SelectInputProps, 'options'>

/**
 * Specification of a Select but then only meant for currency values.
 */
export const CurrencyInput: FC<CurrencyInputProps> = (props) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
    const [currencies, setCurrencies] = useState<Currency[]>()

    useEffect(() => {
        restApi.get<Currency[]>('currencies')
            .then(currencies => setCurrencies(currencies.filter(c => c.enabled)))
    }, [])

    const handleChangeEvent = (e: DropdownChangeEvent) => {
        onChange({
            currentTarget: {
                value: e.value
            }
        })
    }

    if (!currencies) return <></>
    return <>
        <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
            <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>
            <Dropdown id={ props.id }
                      name={ props.id }
                      value={ field.value || props.value }
                      options={ currencies }
                      onChange={ handleChangeEvent }
                      required={ props.required }
                      optionLabel="symbol"
                      optionValue="code"
                      invalid={ field.touched ? errors.length > 0 : undefined }/>
        </div>
    </>
}
