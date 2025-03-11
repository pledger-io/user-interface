import React, { FC, useEffect, useState } from "react";
import AccountRepository from "../../../core/repositories/account-repository";

import { SelectInputProps } from "../input/SelectInput";
import { useInputField } from "../input/InputGroup";
import { i10n } from "../../../config/prime-locale";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

type AccountTypeInputProps = Omit<SelectInputProps, 'options'>

/**
 * Specification of a Select but then only meant for an account type selection.
 */
export const AccountTypeInput: FC<AccountTypeInputProps> = (props) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
    const [accountTypes, setAccountTypes] = useState([])

    useEffect(() => {
        AccountRepository.types()
            .then(setAccountTypes)
    }, [])

    const handleChangeEvent = (e: DropdownChangeEvent) => {
        onChange({
            currentTarget: {
                value: e.value
            }
        })
    }

    if (!field) return <>props.id</>
    return <>
        <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
            <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }</label>
            <Dropdown id={ props.id }
                      name={ props.id }
                      value={ field.value || props.value }
                      options={ accountTypes }
                      onChange={ handleChangeEvent }
                      required={ props.required }
                      valueTemplate={ item => i10n(`AccountType.${ item }`) }
                      itemTemplate={ item => i10n(`AccountType.${ item }`) }
                      invalid={ field.touched ? errors.length > 0 : undefined }/>
        </div>
    </>
}
