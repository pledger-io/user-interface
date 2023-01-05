import {AbstractInput, InputGroup, InputValidationErrors, useInputField} from "./input/AbstractInput";
import React, {useState} from "react";

const MIN_CHARS = 2

export const useAutocomplete = ({
                                    autoCompleteCallback = _ => new Promise(_ => undefined),
                                    entityRender = _ => undefined,
                                    entityLabel = _ => '',
                                },
                                props) => {
    const [field, errors, onChange]         = useInputField({onChange: props.onChange, field: props})
    const [options, setOptions]             = useState([])
    const [selected, setSelected]           = useState(-1)

    const changeHandler = value => onChange({currentTarget: {value: value}, persist: _ => undefined}) || setSelected(-1) || setOptions([])
    const onKeyDown = e => {
        if (options.length > 0) {
            switch (e.key) {
                case 'Escape':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Enter':
                    e.preventDefault()
                    e.stopPropagation()
            }
        }
    }
    const onKeyUp = e => {
        if (options.length > 0) {
            switch (e.key) {
                case 'Escape':
                    e.stopPropagation()
                    this.setState({
                        options: []
                    })
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
            }
        }
    }
    const onAutocomplete = ({currentTarget: {value}}) => {
        if (value.length > MIN_CHARS)
            autoCompleteCallback(value)
                .then(setOptions)
    }

    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <div className='AccountInput'>
                <input type='text'
                       style={{width: '-webkit-max-content'}}
                       onKeyDown={onKeyDown}
                       onKeyUp={onKeyUp}
                       onChange={onAutocomplete}
                       value={entityLabel(field.value)}/>

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

export class Autocomplete extends AbstractInput {
    static MIN_CHARS = 2;

    constructor(props, context, autoCompleteCallback = token => {}) {
        super(props, context);

        this.autoCompleteCallback = autoCompleteCallback
        this.state = {
            options : [],
            resultSelected: -1
        }
    }

    autocomplete(event) {
        const {currentTarget: {value}} = event

        this.setState({
            ...this.state,
            selected: value
        })
        if (value.length > Autocomplete.MIN_CHARS) {
            this.autoCompleteCallback(value)
                .then(options => this.setState({
                    options: options
                }))
        }
    }

    onKeyDown(event) {
        const {options} = this.state

        if (options.length > 0) {
            switch (event.key) {
                case 'Escape':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Enter':
                    event.preventDefault()
                    event.stopPropagation()
            }
        }
    }

    onKeyUp(event) {
        const {options, resultSelected} = this.state

        if (options.length > 0) {
            switch (event.key) {
                case 'Escape':
                    event.stopPropagation()
                    this.setState({
                        options: []
                    })
                    break
                case 'ArrowUp':
                    event.stopPropagation()
                    this.setState({
                        resultSelected: Math.max(0, resultSelected - 1)
                    })
                    break
                case 'ArrowDown':
                    event.stopPropagation()
                    this.setState({
                        resultSelected: Math.min(options.length, resultSelected + 1)
                    })
                    break
                case 'Enter':
                    event.stopPropagation()
                    this.select(options[resultSelected])
                    break
            }
        }
    }

    select(option) {
        const {id, onChange = value => {}} = this.props
        const field = this.context.fields[id] || {};

        onChange(option)
        this.context.onChange({persist: () => {}, currentTarget: {value: option}}, field);
        this.setState({
            options: [],
            selected: option.name
        })
    }
}
