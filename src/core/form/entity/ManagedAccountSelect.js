import React from "react";
import PropTypes from "prop-types";

import restAPI from "../../RestAPI";
import {FormContext} from "../Form";
import {Loading} from "../../index";
import {AbstractInput} from "../input/AbstractInput";

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

export class ManagedAccountSelect extends AbstractInput {
    static contextType = FormContext
    static propTypes = {
        ...AbstractInput.propTypes,
        value: PropTypes.any
    }

    state = {
        accounts: [],
        selectedValue: undefined
    }

    renderInput(field, fieldContext) {
        this.preload()

        const {accounts, selectedValue} = this.state
        if (accounts.length === 0) {
            return <Loading />
        }

        this.initialValue()
        const {id} = this.props
        return (
            <select id={id} onChange={evt => this.onSelect(evt.currentTarget.value)} value={selectedValue} defaultValue="-">
                {!selectedValue && <option disabled value="-">-</option>}
                {accounts.map(account =>
                    <option key={account.id} value={account.id}>{account.name}</option>
                )}
            </select>
        )
    }

    initialValue() {
        if (!this.state.selectedValue && this.props.value) {
            setTimeout(() => this.onSelect(this.props.value), 5);
        }
    }

    onSelect(value) {
        const {id} = this.props
        const {accounts = []} = this.state

        const selectedAccount = accounts.find(account => account.id === parseInt(value))
        this.setState({selectedValue: value})
        this.context.onChange({
            persist: () => {},
            currentTarget: {value: {id: selectedAccount.id, name: selectedAccount.name}}
        }, this.context.fields[id])
    }

    preload() {
        const {accounts = []} = this.state
        if (!accounts.length) {
            service.list()
                .then(accounts => this.setState({accounts: accounts}))
        }
    }
}
