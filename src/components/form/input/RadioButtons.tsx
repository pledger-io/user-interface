import React, { FC } from "react";

import { useInputField } from "./InputGroup";
import { FieldType } from "../form-types";
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";
import { i10n } from "../../../config/prime-locale";

type OptionProp = {
  label: string,
  value: string,
  variant: 'primary' | 'secondary' | 'warning' | 'success'
}

type RadioButtonsProps = FieldType & {
  options: Array<OptionProp>,
  onChange?: (_: string) => void,
  value: string | number
  className?: string
}

export const RadioButtons: FC<RadioButtonsProps> = (props) => {
  const [field, _, onChange] = useInputField({ onChange: props.onChange, field: props })

  const onValueChange = (event: SelectButtonChangeEvent) => {
    onChange({
      currentTarget: {
        value: event.value
      }
    })
  }

  return <>
    <div className={ `card flex items-center justify-center ${ props.className }` }>
      <SelectButton options={ props.options }
                    id={ props.id }
                    name={ props.id }
                    value={ field?.value || props.value }
                    onChange={ onValueChange }
                    itemTemplate={ option => i10n(option.label) }/>
    </div>
  </>
}
