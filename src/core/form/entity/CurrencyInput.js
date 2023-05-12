import React, {useEffect, useState} from "react";

import restAPI from "../../repositories/rest-api";
import {SelectInput, SelectOption} from "../input/SelectInput";

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
                .map(currency => <SelectOption key={currency.code}
                                               value={currency.code}
                                               message={currency.symbol} />)}
        </SelectInput>
    )
}
CurrencyInput.propTypes = SelectInput.propTypes
