import React, {useContext, useEffect} from "react";
import PropTypes from 'prop-types';

import {HelpTranslation, Translation} from "../../Translation";
import {FormContext} from "../Form";

export const InputGroup = ({id, help, title, required = false, valid, children}) => {
    const className = `Input ${required ? 'Required ' : ''}` +
        (valid !== undefined ? (valid ? 'valid' : 'invalid' ) : '')

    return (
        <div className={className}>
            {title && (
                <label htmlFor={id}>
                    <Translation label={title}/>
                    {help ? <HelpTranslation label={help}/> : ''}
                </label>
            )}
            <div>{ children }</div>
        </div>
    )
}
InputGroup.propTypes = {
    // The identifier of the field in the entity
    id: PropTypes.string.isRequired,
    // A text label used for the title of this input (the label)
    title: PropTypes.string,
    // A text label used for any addition help text for this input
    help: PropTypes.string,
    // Indicator if the field is required
    required: PropTypes.bool,
}

export const useInputField = ({onChange, field}) => {
    const formContext    = useContext(FormContext)
    const onChangedEvent = event => {
        formContext.onChange(event, formContext.fields[field.id])
        if (onChange) onChange(event.currentTarget.value)
    }

    useEffect(() => {
        formContext.addField({
            field: field,
            value: field.value || ''
        })
    }, [field.value])

    return [
        formContext.fields[field.id],
        formContext.errors[field.id] || [],
        onChangedEvent
    ]
}

/**
 * For rendering any input validation failures.
 */
export const InputValidationErrors = ({errors, field}) => {
    const formContext = useContext(FormContext)
    return (
        errors.map((error, idx) => (
            <span className='validation' key={idx}>
                <Translation key={idx} label={`${formContext.entity}.${field.id}.${error}`}/>
            </span>
        ))
    )
}
InputValidationErrors.propTypes = {
    // The validation errors
    errors: PropTypes.array,
    // The field the errors are on
    field: PropTypes.object
}


export class AbstractInput extends React.Component {
    static contextType = FormContext
    static propTypes = {
        // The value of the input field
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
        // The identifier of the field in the entity
        id: PropTypes.string.isRequired,
        // A text label used for the title of this input (the label)
        title: PropTypes.string,
        // A text label used for any addition help text for this input
        help: PropTypes.string,
        // Indicator if the field is required
        required: PropTypes.bool,
        // A change handle that will receive an value changes
        onChange: PropTypes.func,
    }

    constructor(props, context) {
        super(props, context);

        this.context.addField({
            field: props,
            value: props.value || ''
        })
    }

    render() {
        const {id, title = undefined, help} = this.props;
        const field = this.context.fields[id] || {};
        const helpComponent = help ? <HelpTranslation label={help}/> : ''

        if (!field.value && this.props.value) {
            setTimeout(() => this.context.addField({
                field: this.props,
                value: this.props.value
            }), 50)
        }

        return field ? (
            <div className={this.computeClass()}>
                {title !== undefined && <label htmlFor={id}><Translation label={title}/>{helpComponent}</label>}
                <div>
                    {this.renderInput(field, this.context)}
                    {this.renderErrors(this.context, field, this.context.errors[id])}
                </div>
            </div>
        ) : ""
    }

    computeClass() {
        const {id, required} = this.props;
        const field = this.context.fields[id] || {touched: false}
        const errors = this.context.errors[id] || []
        const fixedClasses = `Input ${required ? 'Required ' : ''}`

        if (field.touched) {
            return fixedClasses + (errors.length === 0 ? 'valid' : 'invalid');
        }

        return fixedClasses;
    }

    renderErrors(formContext, field, errors = []) {
        if (field.touched) {
            return errors.map((error, index) => {
                return (
                    <span className='validation' key={index}>
                    <Translation key={index} label={`${formContext.entity}.${field.id}.${error}`}/>
                </span>)
            })
        }
        return "";
    }

    renderInput(field, fieldContext) {
    }
}
