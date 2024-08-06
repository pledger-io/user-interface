import { InputGroup, InputValidationErrors, useInputField } from "./input/InputGroup";
import React, { ChangeEventHandler, KeyboardEventHandler, ReactNode, useRef, useState } from "react";
import { Identifiable } from "../../types/types";
import { Button } from "../../components/layout/button";

const MIN_CHARS = 2

type useAutocompleteParams<T extends Identifiable> = {
    autoCompleteCallback: (_ : string) => Promise<Array<T>>,
    entityRender: (_ : T) => ReactNode | ReactNode[],
    entityLabel: (_ : T) => string,
    onCreateCallback?: (_ : string) => Promise<T> | undefined
}
type InputChangeHandler = ChangeEventHandler<HTMLInputElement>

export const useAutocomplete = function <T extends Identifiable>({ autoCompleteCallback, entityRender, entityLabel, onCreateCallback }: useAutocompleteParams<T>, props: any) {
    const [field, errors, onChange] = useInputField({ onChange: undefined, field: props })
    const [options, setOptions] = useState<Array<T>>([])
    const [selected, setSelected] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)

    const changeHandler = (selected: T) => {
        onChange({ currentTarget: { value: selected }, persist: () => undefined })
        setSelected(-1)
        setOptions([])
        if (inputRef.current) inputRef.current.value = entityLabel(selected)
        if (props.onChange) props.onChange(selected)
    }

    const onKeyDown: KeyboardEventHandler = e => {
        if ((/^[\w\s]$/i.test(e.key) || e.key === 'Backspace' || e.key === 'Delete') && field.value) {
            console.trace(`Resetting value for ${field.id} due to value ${e.key}.`)
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
    return (
        <InputGroup id={ props.id }
                    required={ props.required }
                    title={ props.title }
                    help={ props.help }
                    className={ props.className }
                    valid={ field.touched ? errors.length === 0 : undefined }>
            <div className='AccountInput'>
                <input type='text'
                       ref={ inputRef }
                       style={ { width: '-webkit-max-content' } }
                       onKeyDown={ onKeyDown }
                       onKeyUp={ onKeyUp }
                       onChange={ onAutocomplete }
                       defaultValue={ entityLabel(field.value) }/>

                { hasAutocomplete &&
                    <div className='AutoComplete'>
                        { options.map((option, idx) =>
                            <div key={ option.id }
                                 className={ `Result ${ idx === selected ? ' selected' : '' }` }
                                 onClick={ () => changeHandler(option) }>
                                { entityRender(option) }
                            </div>) }
                    </div>
                }

                { hasCreate &&
                    <div className='Create'>
                        <Button label={'common.action.create'}
                                onClick={ () => onCreateCallback(inputRef.current?.value || '')?.then(changeHandler) }/>
                    </div>
                }
            </div>

            { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
        </InputGroup>
    )
}
