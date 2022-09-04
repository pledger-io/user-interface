import React, {createContext} from "react";
import PropTypes from 'prop-types';

import '../../assets/css/Form.scss'

function validateField(field) {
    const {value} = field;
    let errors = [];
    if (field.required && !value) {
        errors.push('required')
    }

    if (field.pattern && value) {
        const pattern = new RegExp(field.pattern, '\i')
        if (!pattern.test(field.value)) {
            errors.push('pattern')
        }
    }

    if (field.hasOwnProperty('min') && value) {
        if (parseInt(value) < field.min) {
            errors.push('min')
        }
    }

    if (field.hasOwnProperty('validators')) {
        for (let idx = 0; idx < field.validators.length; idx++) {
            if (!field.validators[idx].validate(value)) {
                errors.push(field.validators[idx].label)
            }
        }
    }
    return errors;
}

/**
 * The form context allows for validating and updating field values.
 *
 * @type {React.Context<{fields: {}, errors: {}}>}
 */
export const FormContext = createContext({
    /**
     * The fields that are attached to the form
     */
    fields: {},
    /**
     * The errors that are set for any of the attached fields
     */
    errors: {},
    onChange: event => {},
    addField: field => {}
})

/**
 * A form component adds a mutable form to the view for the user. This component supports validation and has a hook
 * to get notified when the form is submitted. This hook is only triggered when there are no validation failures in any
 * of the input components.
 */
export class Form extends React.Component {
    static propTypes = {
        // The handler that will be called with the entity, where the entity is build up of all fields in the form.
        onSubmit: PropTypes.func.isRequired,
        // The entity type, used in error building
        entity: PropTypes.string.isRequired,
        style: PropTypes.oneOf(['group', 'default'])
    }

    state = {
        fields: {},
        errors: {}
    }

    register({field}) {
        const {id} = field;

        field = {
            value: "",
            touched: false,
            ...field
        };

        this.setState(previous => {
            return {
                ...previous,
                errors: {
                    ...previous.errors,
                    [id]: validateField(field)
                },
                fields: {
                    ...previous.fields,
                    [id]: field
                }
            };
        });
    }

    render() {
        const {fields, errors} = this.state;
        const style = this.props.style || 'group'

        const formContext = {
            entity: this.props.entity,
            fields,
            errors,
            addField: field => this.register(field),
            onChange: this.handleInputChanged.bind(this)
        }

        return (
            <form onSubmit={event => this.submit(event)}
                  className={`Form ${style}`}
                  noValidate={true}
                  autoComplete='off'
                  action="">
                <FormContext.Provider value={formContext}>
                    {this.props.children}
                </FormContext.Provider>
            </form>
        )
    }

    handleInputChanged(event, {id}) {
        event.persist();
        const {fields} = this.state;

        this.register({
            field: {
                ...fields[id],
                touched: true,
                value: event.currentTarget.value
            }
        });

        return true
    }

    submit(event) {
        event.preventDefault();

        const {onSubmit} = this.props;
        const entity = {}

        const {fields} = this.state;
        for (const field in fields) {
            entity[field] = fields[field].value;
        }
        if (onSubmit) {
            onSubmit(entity);
        }
        return false;
    }
}
