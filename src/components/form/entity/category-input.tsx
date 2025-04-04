import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { AutoComplete, AutoCompleteChangeEvent } from "primereact/autocomplete";
import React, { useRef } from "react";
import { i10n } from "../../../config/prime-locale";
import CategoryRepository from "../../../core/repositories/category-repository";
import restApi from "../../../core/repositories/rest-api";
import { Category, Identifiable } from "../../../types/types";
import { FieldType } from "../form-types";
import { InputValidationErrors, useInputField } from "../input/InputGroup";

type CategoryInputProps = FieldType & {
  inputOnly?: boolean,
  onChange?: (_: any) => void
  title?: string,
  className?: string
}

type AutocompleteCategory = Identifiable & {
  name: string,
  description: string
}

const CategoryAutocompleteRow = (category: AutocompleteCategory) => {
  return (
    <span data-testid={ `category-autocomplete-row-${ category.id }` }>
      { category.name }
      <div className='text-muted text-xs px-2'>{ category.description }</div>
    </span>
  )
}

function mapCategoryToAutocomplete(category: Category): AutocompleteCategory {
  return {
    id: category.id,
    name: category.label,
    description: category.description
  }
}

export const CategoryInput = (props: CategoryInputProps) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [foundCategories, setFoundCategories] = React.useState<AutocompleteCategory[]>([])
  const autoCompleteRef = useRef<AutoComplete>(null)

  const autoComplete = (query: string) => {
    restApi.get<Category[]>(`categories/auto-complete?token=${ query }`)
      .then(categories => setFoundCategories(categories.map(mapCategoryToAutocomplete)))
  }
  const onChangeHandler = (e: AutoCompleteChangeEvent) => {
    onChange({
      currentTarget: {
        value: e.value
      }
    })
  }

  const onCreate = () => {
    const label = (autoCompleteRef.current?.getInput() as any).value
    CategoryRepository.create({ name: label })
      .then(category => {
          onChange({
            currentTarget: {
              value: category
            }
          })

          autoCompleteRef.current?.hide()
        })
  }

  const createFooter = () => {
    return <>
      <div className='bg-gray-500/30 py-0.5 text-center cursor-pointer' onClick={ onCreate } data-testid='category-input-create'>
        <span className='mx-auto inline-flex'>
          <Icon path={mdiPlus} size={1}/>
          { i10n('page.settings.categories.add') }
        </span>
      </div>
    </>
  }

  if (!field) return props.id
  return <>
    <div className={`flex flex-col gap-2 mt-2 ${ props.className || '' }`}>
      <label htmlFor={ props.id } className='font-bold' data-testid={ `category-input-${ props.id }` }>{ i10n(props.title as string) }</label>

      <AutoComplete id={ props.id }
                    ref={ autoCompleteRef }
                    className='w-full [&>*]:w-full'
                    onClear={ () => onChange({
                      currentTarget: {
                        value: undefined
                      }
                    })}
                    showEmptyMessage={ true }
                    emptyMessage={ i10n('common.overview.noresults') }
                    invalid={ field.touched ? errors.length > 0 : undefined }
                    value={ field.value || props.value }
                    suggestions={ foundCategories }
                    onChange={ onChangeHandler }
                    itemTemplate={ category => CategoryAutocompleteRow(category) }
                    selectedItemTemplate={ category => category.name }
                    panelFooterTemplate={ !props.inputOnly ? createFooter : undefined }
                    completeMethod={ event => autoComplete(event.query) }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
