import React from "react";
import PropTypes from 'prop-types'

import {AbstractInput} from "./AbstractInput";
import Icon from "@mdi/react";
import {mdiClose, mdiPlus} from "@mdi/js";
import {Autocomplete} from "../Autocomplete";
import restAPI from "../../RestAPI";

export class TagInput extends Autocomplete {
    static propTypes = {
        ...AbstractInput.propTypes,
        value: PropTypes.arrayOf(PropTypes.string)
    }

    constructor(props, context) {
        super(props, context, token => restAPI.get(`transactions/tags/auto-complete?token=${token}`));

        this.inputDivRef = React.createRef()
        this.state = {
            ...this.state,
            tagValue: '',
            tags: []
        }
    }

    renderInput(field, fieldContext) {
        return (
            <div className='TagInput'>
                {this.renderTags()}
                <div className='EditableTag'>
                    <div className='Input'
                         ref={this.inputDivRef}
                         onKeyDown={this.onKeyDown.bind(this)}
                         onKeyUp={this.onKeyUp.bind(this)}
                         onKeyUpCapture={event => this.setState({
                             tagValue: event.currentTarget.innerText
                         })}
                         contentEditable={true} />

                    {this.renderCompleteDropdown()}
                </div>
            </div>
        )
    }

    onKeyDown(event) {
        const {tagValue} = this.state
        if (tagValue !== '' && event.key === 'Tab') {
            event.preventDefault()
            event.stopPropagation()
        } else {
            super.onKeyDown(event)
        }
    }

    onKeyUp(event) {
        const {tagValue} = this.state
        if (tagValue !== '' && event.key === 'Tab') {
            event.stopPropagation()
            this.createTag()
            return
        }

        super.onKeyUp(event)
        if (!event.isPropagationStopped()) {
            this.autocomplete({currentTarget: {value: event.currentTarget.innerText}})
        }
    }

    renderCompleteDropdown() {
        const {tagValue, options, resultSelected} = this.state
        if (tagValue === '' && options.length === 0) {
            return ''
        }

        return (
            <div className='AutoComplete'>
                {options.length > 0 &&
                    options.map((tag, idx) =>
                    <div key={idx}
                         className={`Result ${idx === resultSelected ? ' selected' : ''}`}
                         onClick={() => this.select(tag)}>
                        {tag.name}
                    </div>)
                }
                <div className='Result Add' onClick={() => this.createTag()}>
                    <Icon path={mdiPlus}
                          size={.65}/>
                    Hit tab to create
                </div>
            </div>
        )
    }

    renderTags() {
        const {value = undefined} = this.props
        const {tags} = this.state
        if (tags.length === 0) {
            if (value !== undefined) {
                setTimeout(() => this.setState({
                    tags: value
                }), 50)
            }
            return '';
        }

        return tags.map((tag, idx) =>
            <div className='Tag' key={idx}>
                {tag}
                <Icon path={mdiClose}
                      onClick={() => this.removeTag(tag)}
                      size={.5}/>
            </div>
        )
    }

    createTag() {
        const {tagValue, tags} = this.state

        restAPI.post('transactions/tags', {
            tag: tagValue
        }).then(() => {
            this.inputDivRef.current.innerText = ''
            tags.push(tagValue)
            this.setState({
                tagValue: '',
                tags: tags
            })
        })
    }

    select({name}) {
        const {id, onChange = value => {}} = this.props
        const {tags} = this.state
        const field = this.context.fields[id] || {};

        tags.push(name)

        this.inputDivRef.current.innerText = ''
        this.setState({
            options: [],
            tagValue: ''
        })

        onChange(tags)
        this.context.onChange({persist: () => {}, currentTarget: {value: tags}}, field);
    }

    removeTag(toRemove) {
        this.setState({
            tags: this.state.tags.filter(tag => tag !== toRemove)
        })
    }
}
