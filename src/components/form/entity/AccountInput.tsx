import { AutoComplete } from "primereact/autocomplete";
import { useSessionStorage } from "primereact/hooks";
import React, { FC, useRef } from "react";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import AccountRepository from "../../../core/repositories/account-repository";
import RestAPI from "../../../core/repositories/rest-api";
import { Account, AvailableSetting, PagedResponse } from "../../../types/types";
import { FieldType } from "../form-types";
import { InputValidationErrors, useInputField } from "../input/InputGroup";
import { autoCompleteChangeHandler, autoCompleteFooter } from "./auto-complete-helpers";

const AccountAutocompleteRow = (account: Account) => {
  return (
    <span>
      { account.name }
      <span className='ml-2 text-sm text-muted'>{ account.account.iban }</span>
      <div className='text-muted pl-1 text-sm'>{ account.description }</div>
    </span>
  )
}

type AccountType = 'debtor' | 'creditor'
type AccountInputProps = FieldType & {
  value?: Account,
  type?: AccountType | AccountType[],
  title?: string,
  className?: string,
  inputOnly?: boolean,
  onChange?: (_: any) => void
}

/**
 * The account input is used for autocompletion input for both 'debit' and 'credit' type transactions.
 */
export const AccountInput: FC<AccountInputProps> = (props) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [foundAccounts, setFoundAccounts] = React.useState<Account[]>([])
  const autoCompleteRef = useRef<AutoComplete>(null)
  const { success } = useNotification()
  const [numberOfResults, _] = useSessionStorage(20, AvailableSetting.AutocompleteLimit)


  const autoComplete = (query: string) => {
    RestAPI.get<PagedResponse<Account>>(`accounts`, {
      params: {
        type: props.type,
        accountName: query,
        offset: 0,
        numberOfResults: numberOfResults
      }
    })
      .then(page => setFoundAccounts(page.content))
  }

  const onCreate = () => {
    const name = (autoCompleteRef.current?.getInput() as any).value
    AccountRepository.create({
      name: name,
      currency: (RestAPI.user() as any).currency,
      type: props.type
    })
      .then(account => {
        success('page.transaction.edit.account.created')
        onChange({
          currentTarget: {
            value: account
          }
        })
        autoCompleteRef.current?.hide()
      })
  }

  if (!field) return props.id
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id }
             className='font-bold'
             data-testid={ `account-input-${ props.id }` }>
        { i10n(props.title as string) }
      </label>

      <AutoComplete id={ props.id }
                    ref={ autoCompleteRef }
                    className='w-full [&>*]:w-full'
                    onClear={ () => onChange({
                      currentTarget: {
                        value: undefined
                      }
                    }) }
                    showEmptyMessage={ true }
                    emptyMessage={ i10n('common.overview.noresults') }
                    invalid={ field.touched ? errors.length > 0 : undefined }
                    value={ field.value }
                    suggestions={ foundAccounts }
                    onChange={ autoCompleteChangeHandler(onChange) }
                    itemTemplate={ category => AccountAutocompleteRow(category) }
                    selectedItemTemplate={ account => account.name }
                    panelFooterTemplate={ !props.inputOnly ? autoCompleteFooter(onCreate, `page.account.${props.type}.add`) : undefined }
                    completeMethod={ event => autoComplete(event.query) }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
