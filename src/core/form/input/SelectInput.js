import React from "react";
import PropTypes from 'prop-types';

import {AbstractInput} from "./AbstractInput";
import {LocalizationService} from "../../Translation";

/**
 * The select component allows for creating a dropdown where the user can pick one of multiple entries.
 */
export class SelectInput extends AbstractInput {
    static propTypes = AbstractInput.propTypes

    renderInput(field, fieldContext) {
        const {required, children, onChange = value => {}} = this.props
        const value = field.value || this.props.value || '';

        return (
            <select id={field.id}
                    name={field.id}
                    value={field && value}
                    required={required}
                    onChange={e => fieldContext.onChange(e, field) && onChange(e.currentTarget.value)}>
                <option disabled></option>
                {children}
            </select>
        )
    }
}

/**
 * An option in a Select component. A `message` or `label` should be provided, but not both.
 */
export class SelectOption extends React.Component {
    static propTypes = {
        // The message that should be displayed in the dropdown option
        message: PropTypes.string,
        // The label for a translated message in the dropdown option
        label: PropTypes.string,
        // The value of the option in the dropdown
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }

    state = {
        message: ''
    }

    render() {
        const {message, label, value} = this.props

        if (label && !this.state.message) {
            LocalizationService.get(label)
                .then(translations => this.setState({
                    message: translations
                }))
        }

        const display = message || this.state.message
        return <option value={value}>{display}</option>
    }
}
