import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import Loading from "../../../components/layout/loading.component";
import { i10n } from "../../../config/prime-locale";
import AccountRepository from "../../../core/repositories/account-repository";
import { Account } from "../../../types/types";
import { useInputField } from "../input/InputGroup";

export const ManagedAccountSelect = (props: any) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    AccountRepository.own()
      .then(setAccounts)
      .catch(_ => console.error('could not load accounts'))
  }, [])
  useEffect(() => {
    if (props.value) setSelectedId(props.value.id)
  }, [props.value]);

  const valueSelected = (event: any) => {
    const selectedAccount = accounts.filter(account => account.id == event.value)[0]
    onChange({
      persist: () => {},
      currentTarget: { value: selectedAccount }
    })
    setSelectedId(selectedAccount?.id as number)
    if (props.onChange) props.onChange(selectedAccount)
  }

  if (!field || !accounts.length) return <Loading/>
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }</label>
      <Dropdown id={ props.id }
                name={ props.id }
                value={ selectedId }
                options={ accounts }
                onChange={ valueSelected }
                required={ props.required }
                optionValue='id'
                optionLabel='name'
                invalid={ field.touched ? errors.length > 0 : undefined }/>
    </div>
  </>
}
