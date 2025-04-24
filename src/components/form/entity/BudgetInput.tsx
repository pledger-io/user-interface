import { AutoComplete } from "primereact/autocomplete";
import React from "react";
import { i10n } from "../../../config/prime-locale";
import restApi from "../../../core/repositories/rest-api";
import { BudgetExpense } from "../../../types/types";
import { InputValidationErrors, useInputField } from "../input/InputGroup";
import { autoCompleteChangeHandler } from "./auto-complete-helpers";

const BudgetAutocompleteRow = (budget: any) => {
    return (
        <span>
            {budget.name}
            <div className='Summary'>{ budget.description }</div>
        </span>
    )
}

export const BudgetInput = (props : any) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [foundBudgets, setFoundBudgets] = React.useState<BudgetExpense[]>([])

  const autoComplete = (query: string) => {
    restApi.get<BudgetExpense[]>(`budgets/auto-complete?token=${ query }`)
      .then(setFoundBudgets)
  }

  if (!field) return props.id
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id } className='font-bold'
             data-testid={ `budget-input-${ props.id }` }>{ i10n(props.title as string) }</label>

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
                    suggestions={ foundBudgets }
                    onChange={ autoCompleteChangeHandler(onChange) }
                    itemTemplate={ budget => BudgetAutocompleteRow(budget) }
                    selectedItemTemplate={ category => category.name }
                    completeMethod={ event => autoComplete(event.query) }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}