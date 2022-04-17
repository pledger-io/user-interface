import React from "react";
import PropTypes from 'prop-types';

import DatePicker from "react-datepicker";
import {AbstractInput} from "./AbstractInput";

import 'react-datepicker/dist/react-datepicker.css';

/**
 * A date selection component for forms.
 */
export class DateInput extends AbstractInput {
    static dateFormats = {
        nl: 'dd-MM-yyyy',
        en: 'MM/dd/yyyy',
        de: 'dd.MM.yyyy'
    }
    static propTypes = {
        ...AbstractInput.propTypes,
        // Indicator if the field is in read only mode
        readonly: PropTypes.bool
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            selected: (props.hasOwnProperty('value') && props.value) ? new Date(props.value) : ''
        }
    }

    renderInput(field, formContext) {
        const {required, readonly, value} = this.props
        const {selected} = this.state

        if (!selected && value) {
            setTimeout(() => this.setState({
                selected: new Date(value)
            }), 50)
        }

        return <DatePicker required={required}
                           selected={selected}
                           readOnly={readonly}
                           dateFormat={DateInput.dateFormats[localStorage.getItem('language')]}
                           onChange={date => this.selected(date, field)}/>
    }

    selected(date, field) {
        const isoDate = date.toISOString().substr(0, 10)
        this.context.onChange({
            persist: () => {
            }, currentTarget: {value: isoDate}
        }, field)
        this.setState({
            selected: date
        })
    }
}
