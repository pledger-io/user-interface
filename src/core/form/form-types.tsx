import {ChangeEvent} from "react";

export type ValidatorFunc = (value: any) => boolean
export type ValidatorType = {
    label: string,
    validate: ValidatorFunc
}

export type FieldType = {
    id: string,
    value?: string | any,
    required?: boolean,
    pattern?: string,
    min?: number,
    touched?: boolean,
    validators?: ValidatorType[]
}

export type InputChangeFunc<T> = (value: T) => void
export type AddFieldFunc = (instruction: {field: FieldType, value?: any}) => void
export type OnValueChangeFunc = (event: ChangeEvent, field: FieldType) => void

export type FormContextType = {
    // The fields that are attached to the form
    fields: Record<string, FieldType>,
    // The errors that are set for any of the attached fields
    errors: Record<string, string[]>,
    entity: string,
    onChange: OnValueChangeFunc,
    addField: AddFieldFunc
}