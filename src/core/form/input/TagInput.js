import React, {createRef, useState} from "react";
import PropTypes from 'prop-types'

import {InputGroup, useInputField} from "./InputGroup";
import Icon from "@mdi/react";
import {mdiClose, mdiPlus} from "@mdi/js";
import restAPI from "../../repositories/rest-api";

const Tag = ({tag, onRemove = _ => undefined}) => {
    return (
        <div className='Tag'>
            {tag}
            <Icon path={mdiClose}
                  onClick={() => onRemove(tag)}
                  size={.5}/>
        </div>
    )
}

export const TagInput = props => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    const [tagValue, setTagValue] = useState('')
    const [options, setOptions]   = useState([])
    const [selectedIdx, setSelectedIdx]   = useState(-1)

    const onTagRemove = _ => undefined
    const onTagCreate = () => restAPI.post('transactions/tags', {tag: tagValue})
        .then(_ => onSelect({name: tagValue}))

    const onSelect = ({name}) => {
        const updatedTags = (field.value || [])
        updatedTags.push(name)

        inputDivRef.current.innerText = ''
        onChange({persist: () => {}, currentTarget: {value: updatedTags}})
        setOptions([]) || setTagValue('')
    }
    const onKeyUp = event => {
        if (tagValue !== '' && event.key === 'Tab') {
            event.stopPropagation() || onTagCreate()
        } else {
            switch (event.key) {
                case 'Escape': setOptions([]) || event.stopPropagation(); break
                case 'ArrowUp': setSelectedIdx(Math.max(0, selectedIdx - 1)) || event.stopPropagation(); break
                case 'ArrowDown': setSelectedIdx(Math.min(options.length, selectedIdx + 1)) || event.stopPropagation(); break
                case 'Enter': onSelect(options[selectedIdx]) || event.stopPropagation(); break
                default: break
            }

            if (!event.isPropagationStopped() && tagValue.length > 2) {
                restAPI.get(`transactions/tags/auto-complete?token=${tagValue}`)
                    .then(setOptions)
            }
        }
    }
    const onKeyDown = event => {
        if (tagValue !== '' && event.key === 'Tab') {
            event.stopPropagation() || event.preventDefault()
        } else if (options.length) {
            switch (event.key) {
                case 'Escape' | 'ArrowUp' | 'ArrowDown' | 'Enter':
                    event.preventDefault() || event.stopPropagation()
                    break
                default: break
            }
        }
    }

    const inputDivRef = createRef()
    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    className={props.className}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <div className='TagInput'>
                {(field.value || []).map(tag => <Tag tag={tag} onRemove={onTagRemove} key={tag} />)}
                <div className='EditableTag'>
                    <div className='Input'
                         ref={inputDivRef}
                         onKeyDown={onKeyDown}
                         onKeyUp={onKeyUp}
                         onKeyUpCapture={event => setTagValue(event.currentTarget.innerText)}
                         contentEditable={true} />

                    {tagValue !== '' && (
                        <div className='AutoComplete'>
                            {options.map((option, idx) => (
                                <div key={idx}
                                     className={`Result ${idx === selectedIdx ? ' selected' : ''}`}
                                     onClick={() => onSelect(option)}>
                                    {option.name}
                                </div>
                                ))}
                            <div className='Result Add' onClick={onTagCreate}>
                                <Icon path={mdiPlus}
                                      size={.65}/>
                                Hit tab to create
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </InputGroup>
    )
}
TagInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
}
