import React, { useEffect, useState } from "react";

import { InputGroup, useInputField } from "../input/InputGroup";
import PropTypes from "prop-types";

import AccountRepository from "../../repositories/account-repository";
import { SelectOption } from "../input";

import Loading from "../../../components/layout/loading.component";

export const ManagedAccountSelect = props => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
    const [selectedValue, setSelectedValue] = useState()
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        AccountRepository.own()
            .then(setAccounts)
            .catch(_ => console.error('could not load accounts'))
    }, [])
    useEffect(() => {
        if (props.value) setSelectedValue(props.value.id)
    }, [props.value])

    const valueSelected = event => {
        const selectedAccount = accounts.find(account => account.id === parseInt(event.currentTarget.value))
        setSelectedValue(selectedAccount.id)
        onChange({
            persist: () => {},
            currentTarget: { value: selectedAccount }
        })
        if (props.onChange) props.onChange(selectedAccount)
    }

    if (!field || !accounts.length) return <Loading />
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    className={props.className}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <select id={props.id} onChange={valueSelected} value={selectedValue}>
                {props.required && <option disabled={ field.value }>-</option>}
                {accounts.map(account => <SelectOption key={account.id}
                                                       value={account.id}
                                                       message={account.name}/>)}
            </select>
        </InputGroup>
    )
}
ManagedAccountSelect.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.any,
    onChange: PropTypes.func
}
