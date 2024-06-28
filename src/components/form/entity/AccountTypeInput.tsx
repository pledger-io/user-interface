import React, { FC, useEffect, useState } from "react";
import AccountRepository from "../../../core/repositories/account-repository";

import { SelectInput, SelectInputProps, SelectOption } from "../input/SelectInput";

/**
 * Specification of a Select but then only meant for an account type selection.
 */
export const AccountTypeInput: FC<SelectInputProps> = (props) => {
    const [accountTypes, setAccountTypes] = useState([])

    useEffect(() => {
        AccountRepository.types()
            .then(setAccountTypes)
    }, [])

    console.log(props.value)

    return <>
        <SelectInput {...props}>
            {accountTypes.map(type => <SelectOption key={type} value={type} label={`AccountType.${type}`}/>)}
        </SelectInput>
    </>
}
