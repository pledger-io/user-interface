import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { AutoComplete, AutoCompleteChangeEvent } from "primereact/autocomplete";
import React, { useRef, useState } from "react";
import { i10n } from "../../../config/prime-locale.js";
import restAPI from "../../../core/repositories/rest-api";
import { InputValidationErrors, useInputField } from "./InputGroup";

export const TagInput = (props: any) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [options, setOptions] = useState<string[]>([])
  const autoCompleteRef = useRef<AutoComplete>(null)

  const autoComplete = (query: string) => {
    restAPI.get<string[]>(`tags?name=${query}`).then(tags => setOptions(tags))
  }
  const onChangeHandler = (e: AutoCompleteChangeEvent) => {
    onChange({
        currentTarget: {
          value: e.value
        }
      })
  }
  const onCreate = () => {
    const tagValue = (autoCompleteRef.current?.getInput() as any).value
    restAPI.post('tags', { name: tagValue })
      .then(_ => {
        onChange({
          currentTarget: {
            value: [...(field.value || []), tagValue]
          }
        })

        autoCompleteRef.current?.hide()
      })
  }

  const createFooter = () => {
    return <>
      <div className='bg-gray-500/30 py-0.5 text-center cursor-pointer' onClick={ onCreate }>
        <span className='mx-auto inline-flex'>
          <Icon path={mdiPlus} size={1}/>
          Create new tag
        </span>
      </div>
    </>
  }

  if (!field) return props.id
  return <>
    <div className={`flex flex-col gap-2 mt-2 ${ props.className || '' }`}>
      <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title) }</label>
      <AutoComplete id={ props.id }
                    ref={ autoCompleteRef }
                    multiple={ true }
                    className='w-full [&>*]:w-full'
                    showEmptyMessage={ true }
                    emptyMessage={ i10n('common.overview.noresults') }
                    invalid={ field.touched ? errors.length > 0 : undefined }
                    value={ field.value || props.value }
                    suggestions={ options }
                    onChange={ onChangeHandler }
                    panelFooterTemplate={ createFooter }
                    completeMethod={ event => autoComplete(event.query) }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
