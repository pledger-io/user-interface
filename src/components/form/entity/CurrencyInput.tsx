import React, { FC, useEffect, useState } from "react";
import restApi from "../../../core/repositories/rest-api";
import { Currency } from "../../../types/types";

import { SelectInput, SelectInputProps, SelectOption } from "../input/SelectInput";

/**
 * Specification of a Select but then only meant for currency values.
 */
export const CurrencyInput: FC<SelectInputProps> = (props) => {
    const [currencies, setCurrencies] = useState<Currency[]>()

    useEffect(() => {
        restApi.get<Currency[]>('settings/currencies').then(setCurrencies)
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
