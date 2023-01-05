import React, {useEffect, useState} from "react";

import {AccountRepository} from "../../RestAPI";
import {Loading} from "../../index";
import {InputGroup, useInputField} from "../input/InputGroup";
import {EntityShapes} from "../../../config";
import PropTypes from "prop-types";

export const ManagedAccountSelect = props => {
    const [field, errors, onChange]         = useInputField({onChange: props.onChange, field: props})
    const [selectedValue, setSelectedValue] = useState()
    const [accounts, setAccounts]           = useState([])

    useEffect(() => {
        AccountRepository.own().then(setAccounts)
    }, [])

    const valueSelected = event => {
        const selectedAccount = accounts.find(account => account.id === parseInt(event.currentTarget.value))
        setSelectedValue(selectedAccount.id)
        onChange({
            persist: () => {},
            currentTarget: {value: selectedAccount}
        })
    }

    if (!field || !accounts.length) return <Loading />
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <select id={props.id} onChange={valueSelected} value={selectedValue} defaultValue="-">
                {!selectedValue && <option disabled value="-">-</option>}
                {accounts.map(account =>
                    <option key={account.id} value={account.id}>{account.name}</option>
                )}
            </select>
        </InputGroup>
    )
}
ManagedAccountSelect.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.any
}
