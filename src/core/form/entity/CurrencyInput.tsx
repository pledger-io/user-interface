import React, {FC, useEffect, useState} from "react";

import restAPI from "../../repositories/rest-api";
import {SelectInput, SelectInputProps, SelectOption} from "../input/SelectInput";
import {Category} from "../../types";

/**
 * Specification of a Select but then only meant for currency values.
 */
export const CurrencyInput: FC<SelectInputProps> = (props) => {
    const [currencies, setCurrencies] = useState<Category[]>()

    useEffect(() => {
        restAPI.get('settings/currencies').then(setCurrencies)
    }, [])

    if (!currencies) return <></>
    return (
        <SelectInput {...props}>
            {(currencies || [])
                .filter(currency => currency.enabled)
                .map(currency => <SelectOption key={ currency.code }
                                               value={ currency.code }
                                               message={ currency.symbol } />)}
        </SelectInput>
    )
}
CurrencyInput.propTypes = SelectInput.propTypes
