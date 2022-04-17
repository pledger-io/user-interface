import React from "react";

import restAPI from "../../RestAPI";
import {SelectInput, SelectOption} from "../input/SelectInput";

class ManagedAccountService {
    lastFetch = null
    cachedList = null

    list() {
        const now = new Date()
        if (this.lastFetch == null || now.getTime() - this.lastFetch > 2000) {
            this.lastFetch = now.getTime()
            this.cachedList = new Promise((resolved, failed) => {
                restAPI.get('accounts/my-own')
                    .then(resolved)
                    .catch(failed)
            })
        }

        return this.cachedList
    }
}
const service = new ManagedAccountService()

export class ManagedAccountSelect extends React.Component {
    state = {
        accounts: []
    }

    constructor(props, context) {
        super(props, context);
        service.list()
            .then(accounts => this.setState({
                accounts: accounts
            }))
    }

    render() {
        const {accounts} = this.state

        return (
            <SelectInput {...this.props}>
                {accounts.map(account => <SelectOption key={account.id} value={account.id} message={account.name} />)}
            </SelectInput>
        )
    }
}
