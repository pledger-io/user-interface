import React, { FC } from "react";

import { Translation } from "../../localization";
import { useInputField } from "./InputGroup";
import { FieldType } from "../form-types";

type OptionProp = {
    label: string,
    value: string,
    variant: 'primary' | 'secondary' | 'warning' | 'success'
}

type RadioButtonsProps = FieldType & {
    options: Array<OptionProp>,
    onChange?: (_: string) => void,
    value: string | number
}

export const RadioButtons: FC<RadioButtonsProps> = (props) => {
    const [field, _, onChange] = useInputField({ onChange: props.onChange, field: props })

    return (
        <div className='RadioButton'>
            {props.options.map(option => (
                <label key={option.value}
                       htmlFor={`option-${option.value}`}
                       onClick={() => onChange({ persist: () => {}, currentTarget: { value: option.value } })}
                       className={`${option.variant} ${field?.value === option.value ? 'selected' : ''}`}>
                    <input type='radio'
                           value={option.value}
                           name={`option-${option.value}`}/>
                    <Translation label={option.label}/>
                </label>
            ))}
        </div>
    )
}
