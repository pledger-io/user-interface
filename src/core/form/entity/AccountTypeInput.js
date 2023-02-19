import React, {useEffect, useState} from "react";

import {AccountRepository} from "../../RestAPI";
import {SelectInput, SelectOption} from "../input/SelectInput";

/**
 * Specification of a Select but then only ment for an account type selection.
 */
export const AccountTypeInput = (props) => {
    const [accountTypes, setAccountTypes] = useState([])

    useEffect(() => {
        AccountRepository.types()
            .then(setAccountTypes)
    }, [])

    return <>
        <SelectInput {...props}>
            {accountTypes.map(type => <SelectOption key={type} value={type} label={`AccountType.${type}`}/>)}
        </SelectInput>
    </>
}
AccountTypeInput.propTypes = SelectInput.propTypes
