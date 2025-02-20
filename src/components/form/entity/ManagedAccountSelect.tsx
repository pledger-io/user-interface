import React, {useEffect, useState} from "react";

import {InputGroup, useInputField} from "../input/InputGroup";

import {SelectOption} from "../input";

import Loading from "../../../components/layout/loading.component";
import AccountRepository from "../../../core/repositories/account-repository";
import {Account, Identifier} from "../../../types/types";

export const ManagedAccountSelect = (props: any) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})
    const [selectedValue, setSelectedValue] = useState<Identifier>()
    const [accounts, setAccounts] = useState<Account[]>([])

    useEffect(() => {
        AccountRepository.own()
            .then(setAccounts)
            .catch(_ => console.error('could not load accounts'))
    }, [])
    useEffect(() => {
        if (props.value) setSelectedValue(props.value.id)
    }, [props.value])

    const valueSelected = (event: any) => {
        const selectedAccount = accounts.find(account => account.id === parseInt(event.currentTarget.value))
        setSelectedValue(selectedAccount?.id)
        onChange({
            persist: () => {
            },
            currentTarget: {value: selectedAccount}
        })
        if (props.onChange) props.onChange(selectedAccount)
    }

    if (!field || !accounts.length) return <Loading/>
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    className={props.className}
                    valid={field.touched ? errors.length === 0 : undefined}>
            <select id={props.id} onChange={valueSelected} value={selectedValue}>
                {props.required && <option disabled={field.value}>-</option>}
                {accounts.map(account => <SelectOption key={account.id}
                                                       value={account.id as string}
                                                       message={account.name}/>)}
            </select>
        </InputGroup>
    )
}
