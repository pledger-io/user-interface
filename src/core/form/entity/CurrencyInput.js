import React from "react";

import restAPI from "../../RestAPI";
import {SelectInput} from "../input/SelectInput";

/**
 * Specification of a Select but then only ment for currency values.
 */
export class CurrencyInput extends React.Component {
    static propTypes = SelectInput.propTypes

    state = {
        currencies: []
    }

    render() {
        const {currencies} = this.state
        if (!currencies.length) {
            restAPI.get('settings/currencies')
                .then(currencies => this.setState({
                    currencies: currencies
                }))
        }

        const options = currencies
            .filter(currency => currency.enabled)
            .map(currency => <option key={currency.code} value={currency.code}>{currency.symbol}</option>)

        return (
            <SelectInput {...this.props}>
                {options}
            </SelectInput>
        )
    }
}
