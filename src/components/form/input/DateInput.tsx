import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import { InputValidationErrors, useInputField } from "./InputGroup";

import { FieldType } from "../form-types";

const DateFormats = {
  nl: 'dd-mm-yy',
  en: 'mm/dd/yy',
  de: 'dd.mm.yy'
}
type DateFormatLanguage = keyof typeof DateFormats;

type DateInputProps = FieldType & {
  onChange?: (_: string) => void
  help?: string
  readonly?: boolean,
  minDate?: Date
  view?: 'date' | 'month' | 'year'
}

function dateToString(date: DateChangedType): string | undefined {
  if (!date) return undefined
  return `${ date.getFullYear() }-${ String(date.getMonth() + 1).padStart(2, '0') }-${ String(date.getDate()).padStart(2, '0') }`
}

/**
 * A date selection component for forms.
 */
export const DateInput = (props: DateInputProps) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [selected, setSelected] = useState<Date | null>(null)

  const onDateChanged = (date: Date | null | undefined) => {
    if (date == null) {
      setSelected(new Date())
      onChange({
        persist: () => {
        },
        currentTarget: { value: null }
      })
    } else {
      setSelected(date)
      onChange({
        persist: () => {
        },
        currentTarget: { value: dateToString(date) }
      })
    }
  }

  useEffect(() => {
    if (props.value) setSelected(new Date(props.value))
  }, [props.value])

  if (!field) return <></>
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }</label>
      <Calendar id={ props.id }
                showIcon={ true }
                disabled={ props.readonly }
                minDate={ props.minDate }
                view={ props.view || 'date' }
                dateFormat={ DateFormats[localStorage.getItem('language') as DateFormatLanguage] }
                onChange={ e => onDateChanged(e.value) }
                invalid={ field.touched ? errors.length > 0 : undefined }
                required={ props.required }
                value={ selected }/>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}

type DateChangedType = Date | undefined
export const DateRangeInput = (props: any) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })

  const onDateChanged = (startDate: DateChangedType, endDate: DateChangedType) => {
    const value = {
      start: dateToString(startDate) || field.value?.start,
      end: dateToString(endDate) || field.value?.end,
    }

    onChange(
      {
        persist: () => {
        },
        currentTarget: {
          value
        }
      })
  }

  if (!field) return <></>
  const startDate = field.value?.start ? new Date(field.value.start) : undefined
  const endDate = field.value?.end ? new Date(field.value.end) : undefined
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }</label>
      <div className='flex gap-2 items-center'>
        <Calendar id={ props.id }
                  showIcon={ true }
                  disabled={ props.readonly }
                  maxDate={ endDate }
                  dateFormat={ DateFormats[localStorage.getItem('language') as DateFormatLanguage] }
                  onChange={ e => onDateChanged(e.value || undefined, undefined) }
                  invalid={ field.touched ? errors.length > 0 : undefined }
                  required={ props.required }
                  value={ startDate }/>
        <span>-</span>
        <Calendar id={ props.id }
                  showIcon={ true }
                  disabled={ props.readonly }
                  minDate={ startDate }
                  dateFormat={ DateFormats[localStorage.getItem('language') as DateFormatLanguage] }
                  onChange={ e => onDateChanged(undefined, e.value || undefined) }
                  invalid={ field.touched ? errors.length > 0 : undefined }
                  required={ props.required }
                  value={ endDate }/>
      </div>

      { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </div>
  </>
}
