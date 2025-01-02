import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import { InputGroup, InputValidationErrors, useInputField } from "./InputGroup";

import 'react-datepicker/dist/react-datepicker.css';
import {FieldType} from "../form-types";

const DateFormats = {
    nl: 'dd-MM-yyyy',
    en: 'MM/dd/yyyy',
    de: 'dd.MM.yyyy'
}
type DateFormatLanguage = keyof typeof DateFormats;

type DateInputProps = FieldType & {
    onChange?: (_: string) => void
    help?: string
    readonly?: boolean,
    minDate?: Date
}

/**
 * A date selection component for forms.
 */
export const DateInput = (props: DateInputProps) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
    const [selected, setSelected]   = useState(new Date())

    const onDateChanged = (date: Date | null) => {
        if (date == null) {
            setSelected(new Date())
            onChange({
                persist: () => {},
                currentTarget: { value: null }
            })
        } else {
            const isoDate = date.toISOString().substring(0, 10)
            setSelected(date)
            onChange({
                persist: () => {},
                currentTarget: { value: isoDate }
            })
        }
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
                    inputClassName='!block'
                    valid={field.touched ? errors.length === 0 : undefined }>
            <DatePicker required={props.required}
                        selected={selected}
                        readOnly={props.readonly}
                        minDate={props.minDate}
                        showYearDropdown={ true }
                        dateFormat={DateFormats[localStorage.getItem('language') as DateFormatLanguage]}
                        onChange={ onDateChanged }/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}

export const MonthPicker = (props: any) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
    const [selected, setSelected]   = useState<Date>(new Date())

    const onDateChanged = (date: Date | null) => {
        if (date == null) {
            setSelected(new Date())
            onChange({
                persist: () => {},
                currentTarget: { value: null }
            })
        } else {
            const isoDate = date.toISOString().substring(0, 10)
            setSelected(date)
            onChange({
                persist: () => {},
                currentTarget: { value: isoDate }
            })
        }
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
                        showMonthYearPicker
                        showFullMonthYearPicker
                        dateFormat='MM/yyyy'
                        onChange={ onDateChanged }/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}

export const DateRangeInput = (props: any) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })

    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate]     = useState<Date>()

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
        const { start, end } = props.value
        if (start && end) {
            setEndDate(new Date(end))
            setStartDate(new Date(start))
        }
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
                            selectsStart
                            showMonthDropdown
                            useShortMonthInDropdown
                            showYearDropdown
                            readOnly={props.readonly}
                            dateFormat={DateFormats[localStorage.getItem('language') as DateFormatLanguage]}
                            onChange={ (date) => {
                                if (date != null) setStartDate(date)
                            } }/>
                <span>-</span>
                <DatePicker required={props.required}
                            selected={endDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectsEnd
                            showMonthDropdown
                            useShortMonthInDropdown
                            showYearDropdown
                            readOnly={props.readonly}
                            dateFormat={DateFormats[localStorage.getItem('language') as DateFormatLanguage]}
                            onChange={ (date) => {
                                if (date != null) setEndDate(date)
                            }  }/>
            </div>
        </InputGroup>
    </>
}
