import {InputGroup, InputValidationErrors, useInputField} from "./input/InputGroup";
import React, {ChangeEventHandler, KeyboardEventHandler, ReactNode, useRef, useState} from "react";
import {Identifiable} from "../types";

const MIN_CHARS = 2

type useAutocompleteParams<T extends Identifiable> = {
    autoCompleteCallback: (_ : string) => Promise<Array<T>>,
    entityRender: (_ : T) => ReactNode | ReactNode[],
    entityLabel: (_ : T) => string
}
type InputChangeHandler = ChangeEventHandler<HTMLInputElement>

export const useAutocomplete = function <T extends Identifiable>({autoCompleteCallback, entityRender, entityLabel}: useAutocompleteParams<T>, props: any) {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})
    const [options, setOptions] = useState<Array<T>>([])
    const [selected, setSelected] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)

    const changeHandler = (selected: T) => {
        onChange({currentTarget: {value: selected}, persist: () => undefined})
        setSelected(-1)
        setOptions([])
        if (inputRef.current) inputRef.current.value = entityLabel(selected)
    }

    const onKeyDown: KeyboardEventHandler = e => {
        const actualKeyValue = String.fromCharCode(e.which).match(/(\w|\s)/g)
        if ((actualKeyValue || e.key === 'Backspace' || e.key === 'Delete') && field.value) {
            // reset the value on new key presses
            onChange({currentTarget: {value: undefined}, persist: (_: any) => undefined})
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
                default: break
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
                default: break
            }
        }
    }
    const onAutocomplete: InputChangeHandler = ({currentTarget: {value}}) => {
        if (value.length > MIN_CHARS)
            autoCompleteCallback(value)
                .then(setOptions)
    }

    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <div className='AccountInput'>
                <input type='text'
                       ref={inputRef}
                       style={{width: '-webkit-max-content'}}
                       onKeyDown={onKeyDown}
                       onKeyUp={onKeyUp}
                       onChange={onAutocomplete}
                       defaultValue={entityLabel(field.value)}/>

                {options.length > 0 &&
                    <div className='AutoComplete'>
                        {options.map((option, idx) =>
                            <div key={option.id}
                                 className={`Result ${idx === selected ? ' selected' : ''}`}
                                 onClick={() => changeHandler(option)}>
                                {entityRender(option)}
                            </div>)}
                    </div>
                }
            </div>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}