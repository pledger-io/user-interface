import React from "react";

import restAPI from "../../RestAPI";
import {SelectInput, SelectOption} from "../input/SelectInput";

/**
 * Specification of a Select but then only ment for an account type selection.
 */
export class AccountTypeInput extends React.Component {
    static propTypes = SelectInput.propTypes

    state = {
        types: []
    }

    render() {
        const {types} = this.state
        if (!types.length) {
            restAPI.get('account-types')
                .then(types => this.setState({
                    types: types
                }))
        }

        return <SelectInput {...this.props}>
            {types.map(type => <SelectOption key={type} value={type} label={`AccountType.${type}`}/>)}
        </SelectInput>
    }
}
