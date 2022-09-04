import React from "react";

import restAPI from "../../RestAPI";
import {SelectInput, SelectOption} from "../input/SelectInput";
import {FormContext} from "../Form";

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
    static contextType = FormContext

    state = {}

    render() {
        const {accounts = []} = this.state
        if (!accounts.length) {
            service.list()
                .then(accounts => this.setState({
                    accounts: accounts,
                    loaded: true
                }))
        }
        const accountSelected = value => {
            const {id} = this.props
            const selectedAccount = accounts.find(account => account.id === parseInt(value))

            this.context.onChange({
                persist: () => {},
                currentTarget: {value: {id: selectedAccount.id, name: selectedAccount.name}}
            }, this.context.fields[id])
        }

        return (
            <SelectInput {...this.props} onChange={id => accountSelected(id)}>
                {accounts.map(account => <SelectOption key={account.id} value={account.id} message={account.name} />)}
            </SelectInput>
        )
    }
}
