import { AutoComplete } from "primereact/autocomplete";
import React, { Attributes } from "react";
import { i10n } from "../../../config/prime-locale";
import RestAPI from "../../../core/repositories/rest-api";
import { Contract } from "../../../types/types";
import { FieldType } from "../form-types";
import { InputValidationErrors, useInputField } from "../input/InputGroup";
import { autoCompleteChangeHandler } from "./auto-complete-helpers";

const ContractAutocompleteRow = (contract: Contract) => {
    return (
        <span>
            {contract.name}
            <div className='Summary'>{contract.description}</div>
        </span>
    )
}

type ContractInputProps = FieldType & Attributes & {
    onChange?: (_: any) => void
}

export const ContractInput = (props: ContractInputProps) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [foundContracts, setFoundContracts] = React.useState<Contract[]>([])

  const autoComplete = (query: string) => {
    RestAPI.get<Contract[]>(`contracts?name=${query}`)
      .then(setFoundContracts)
  }

  if (!field) return props.id
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id }
             className='font-bold'
             data-testid={ `contract-input-${ props.id }` }>
        { i10n(props.title as string) }
      </label>

      <AutoComplete id={ props.id }
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
                    suggestions={ foundContracts }
                    onChange={ autoCompleteChangeHandler(onChange) }
                    itemTemplate={ category => ContractAutocompleteRow(category) }
                    selectedItemTemplate={ account => account.name }
                    completeMethod={ event => autoComplete(event.query) }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
