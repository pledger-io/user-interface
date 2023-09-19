import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import DatePicker from "react-datepicker";
import {InputGroup, InputValidationErrors, useInputField} from "./InputGroup";

import 'react-datepicker/dist/react-datepicker.css';

const DateFormats = {
    nl: 'dd-MM-yyyy',
    en: 'MM/dd/yyyy',
    de: 'dd.MM.yyyy'
}

/**
 * A date selection component for forms.
 */
export const DateInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})
    const [selected, setSelected]   = useState(new Date())

    const onDateChanged = date => {
        const isoDate = date.toISOString().substring(0, 10)
        setSelected(date)
        onChange({
            persist: () => {},
            currentTarget: {value: isoDate}
        })
    }

    useEffect(() => {
        if (props.value) setSelected(new Date(props.value))
    }, [props.value])

    if (!field) return <></>
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <DatePicker required={props.required}
                        selected={selected}
                        readOnly={props.readonly}
                        showYearDropdown
                        dateFormat={DateFormats[localStorage.getItem('language')]}
                        onChange={onDateChanged}/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}
DateInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.string,
    // Indicator if the field is in read only mode
    readonly: PropTypes.bool
}

export const DateRangeInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate]     = useState()

    useEffect(() => {
        if (!startDate || !endDate) return
        onChange({
            persist: () => {},
            currentTarget: {
                value: {
                    start: startDate.toISOString().substring(0, 10),
                    end: endDate.toISOString().substring(0, 10)
                }
            }
        })
    }, [startDate, endDate, onChange])
    useEffect(() => {
        const {start, end} = props.value
        if (start && end) setEndDate(new Date(end)) || setStartDate(new Date(start))
    }, [props.value])

    if (!field) return <></>
    return <>
        <InputGroup id={props.id}
                    title={props.title}
                    help={props.help}
                    required={props.required}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <div className='DateRange'>
                <DatePicker required={props.required}
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectStart
                            showMonthDropdown
                            useShortMonthInDropdown
                            showYearDropdown
                            readOnly={props.readonly}
                            dateFormat={DateFormats[localStorage.getItem('language')]}
                            onChange={setStartDate}/>
                <span>-</span>
                <DatePicker required={props.required}
                            selected={endDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectEnd
                            showMonthDropdown
                            useShortMonthInDropdown
                            showYearDropdown
                            readOnly={props.readonly}
                            dateFormat={DateFormats[localStorage.getItem('language')]}
                            onChange={setEndDate}/>
            </div>
        </InputGroup>
    </>
}
