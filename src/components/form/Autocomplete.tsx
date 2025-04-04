import { Resolver } from "../../core";
import { InputValidationErrors, useInputField } from "./input/InputGroup";
import React, { ChangeEventHandler, KeyboardEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import { Identifiable } from "../../types/types";
import { Button } from "../../components/layout/button";
import { i10n } from "../../config/prime-locale";
import { mdiPlusCircle } from "@mdi/js";

const MIN_CHARS = 2

type useAutocompleteParams<T extends Identifiable> = {
  autoCompleteCallback: (_: string) => Promise<Array<T>>,
  entityRender: (_: T) => ReactNode | ReactNode[],
  entityLabel: (_: T) => string,
  onCreateCallback?: (_: string) => Promise<T> | undefined
}
type InputChangeHandler = ChangeEventHandler<HTMLInputElement>

const isString = (value: any) => typeof value === "string" || value instanceof String

export const useAutocomplete = function <T extends Identifiable>({
                                                                   autoCompleteCallback,
                                                                   entityRender,
                                                                   entityLabel,
                                                                   onCreateCallback
                                                                 }: useAutocompleteParams<T>, props: any) {
  const [field, errors, onChange, onBlur] = useInputField({ onChange: undefined, field: props })
  const [options, setOptions] = useState<Array<T>>([])
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!field?.touched && props.value && inputRef.current && props.value !== inputRef.current?.value) {
      console.debug(`\tUpdating autocomplete field ${ props.id } value ${ props.value }.`)
      inputRef.current.value = isString(props.value) ? props.value : entityLabel(props.value)
    }
  }, [props.value]);

  const changeHandler = (selected: T) => {
    onChange({ currentTarget: { value: selected }, persist: () => undefined })
    onBlur()
    setSelected(-1)
    setOptions([])
    if (inputRef.current) inputRef.current.value = entityLabel(selected)
    if (props.onChange) props.onChange(selected)
  }

  const onKeyDown: KeyboardEventHandler = e => {
    if ((/^[\w\s]$/i.test(e.key) || e.key === 'Backspace' || e.key === 'Delete') && field.value) {
      console.debug(`\tResetting value for ${ field.id } due to value ${ e.key }.`)
      // reset the value on new key presses
      onChange({ currentTarget: { value: undefined }, persist: (_: any) => undefined })
    }

    if (options.length > 0) {
      switch (e.key) {
        case 'Escape':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Enter':
          e.preventDefault()
          e.stopPropagation()
          break
        default:
          break
      }
    }
  }
  const onKeyUp: KeyboardEventHandler = e => {
    if (options.length > 0) {
      switch (e.key) {
        case 'Escape':
          e.stopPropagation()
          setOptions([])
          break
        case 'ArrowUp':
          e.stopPropagation()
          setSelected(Math.max(0, selected - 1))
          break
        case 'ArrowDown':
          e.stopPropagation()
          setSelected(Math.min(options.length, selected + 1))
          break
        case 'Enter':
          e.stopPropagation()
          changeHandler(options[selected])
          break
        default:
          break
      }
    }
  }
  const onAutocomplete: InputChangeHandler = ({ currentTarget: { value } }) => {
    if (value.length > MIN_CHARS)
      autoCompleteCallback(value)
        .then(setOptions)
  }

  const hasAutocomplete = options.length > 0
  const hasCreate = onCreateCallback
    && inputRef.current?.value && inputRef.current?.value.length > MIN_CHARS
    && !field.value
  if (!field) return props.id

  return <>
    <div className={ `flex flex-col gap-2 mt-2 relative ${ props.className || '' }` }>
      { props.title && <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }</label> }

      <div className='flex items-center'>
        <input type='text'
               ref={ inputRef }
               onKeyDown={ onKeyDown }
               onKeyUp={ onKeyUp }
               onChange={ onAutocomplete }
               autoComplete={ Resolver.uuid() }
               autoCapitalize='off'
               autoCorrect='off'
               className='p-inputtext p-filled flex-grow'
               defaultValue={ entityLabel(field.value) }/>
        { hasCreate &&
          <Button tooltip={ i10n('common.action.create') }
                  severity='secondary'
                  type='button'
                  className='rounded-none! h-[50px]'
                  icon={ mdiPlusCircle }
                  onClick={ () => onCreateCallback(inputRef.current?.value || '')?.then(changeHandler) }/>
        }
      </div>

      { hasAutocomplete &&
        <div className='border-1 absolute top-[5rem] bg-white z-10 w-full'>
          { options.map((option, idx) =>
            <div key={ option.id }
                 className={ `p-2 border-b-1 border-b-gray-400/30 border-dashed ${ idx === selected ? 'bg-gray-500/20 ' : '' } hover:bg-gray-500/10` }
                 onClick={ () => changeHandler(option) }>
              { entityRender(option) }
            </div>) }
        </div>
      }

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
