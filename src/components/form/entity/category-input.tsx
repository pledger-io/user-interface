import { AutoComplete } from "primereact/autocomplete";
import { useSessionStorage } from "primereact/hooks";
import React, { useRef } from "react";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import CategoryRepository from "../../../core/repositories/category-repository";
import restApi from "../../../core/repositories/rest-api";
import { AvailableSetting, Category, Identifiable, PagedResponse } from "../../../types/types";
import { FieldType } from "../form-types";
import { InputValidationErrors, useInputField } from "../input/InputGroup";
import { autoCompleteChangeHandler, autoCompleteFooter } from "./auto-complete-helpers";

type CategoryInputProps = FieldType & {
  inputOnly?: boolean,
  onChange?: (_: any) => void
  title?: string,
  className?: string
}

const CategoryAutocompleteRow = (category: Category) => {
  return (
    <span data-testid={ `category-autocomplete-row-${ category.id }` }>
      { category.name }
      <div className='text-muted text-xs px-2'>{ category.description }</div>
    </span>
  )
}

export const CategoryInput = (props: CategoryInputProps) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [foundCategories, setFoundCategories] = React.useState<Category[]>([])
  const autoCompleteRef = useRef<AutoComplete>(null)
  const { success } = useNotification()
  const [numberOfResults, _] = useSessionStorage(20, AvailableSetting.AutocompleteLimit)

  const autoComplete = (query: string) => {
    restApi.get<PagedResponse<Category>>(`categories`, {
      params: {
        name: query,
        offset: 0,
        numberOfResults: numberOfResults,
      }
    })
      .then(response => setFoundCategories(response.content))
  }

  const onCreate = () => {
    const label = (autoCompleteRef.current?.getInput() as any).value
    CategoryRepository.create({ name: label })
      .then(category => {
        success('page.settings.categories.created')
        onChange({
          currentTarget: {
            value: category
          }
        })

        autoCompleteRef.current?.hide()
      })
  }

  if (!field) return props.id
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id } className='font-bold'
             data-testid={ `category-input-${ props.id }` }>{ i10n(props.title as string) }</label>

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
                    suggestions={ foundCategories }
                    onChange={ autoCompleteChangeHandler(onChange) }
                    itemTemplate={ category => CategoryAutocompleteRow(category) }
                    selectedItemTemplate={ category => category.name }
                    panelFooterTemplate={ !props.inputOnly ? autoCompleteFooter(onCreate, 'page.settings.categories.add') : undefined }
                    completeMethod={ event => autoComplete(event.query) }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
