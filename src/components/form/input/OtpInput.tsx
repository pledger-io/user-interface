import { InputOtp, InputOtpChangeEvent } from "primereact/inputotp";
import React, { FC } from "react";
import { i10n } from "../../../config/prime-locale";
import { FieldType } from "../form-types";
import { InputValidationErrors, useInputField } from "./InputGroup";

type OtpInputProps = FieldType & {
  onChange?: (_: any) => void,
}

export const OtpInput: FC<OtpInputProps> = (props) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })

  const onChangeHandler = (e: InputOtpChangeEvent) => {
    onChange({
      currentTarget: {
        value: e.value
      }
    })
  }

  if (!field) return <></>
  return <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
    <label htmlFor={ props.id }
           className='font-bold'>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>

    <InputOtp id={ props.id }
              name={ props.id }
              length={ 6 }
              required={ props.required }
              onChange={ onChangeHandler }
              defaultValue={ field.value || props.value }/>

    { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
  </div>
}
