import React, {useEffect, useState} from "react";

import restAPI from "../../repositories/rest-api";
import {SelectInput} from "../input/SelectInput";

/**
 * Specification of a Select but then only meant for currency values.
 * @param props
 * @returns {*|JSX.Element}
 * @constructor
 */
export const CurrencyInput = (props) => {
    const [currencies, setCurrencies] = useState()

    useEffect(() => {
        restAPI.get('settings/currencies').then(setCurrencies)
    }, [])

    if (!currencies) return props.id
    return (
        <SelectInput {...props}>
            {(currencies || [])
                .filter(currency => currency.enabled)
                .map(currency => <option key={currency.code} value={currency.code}>{currency.symbol}</option>)}
        </SelectInput>
    )
}
CurrencyInput.propTypes = SelectInput.propTypes
