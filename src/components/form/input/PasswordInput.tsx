import { InputIcon } from "primereact/inputicon";
import React, { FC } from "react";
import Icon from "@mdi/react";
import { mdiAlertCircle, mdiCheck } from "@mdi/js";
import { useInputField } from "./InputGroup";
import { FieldType, ValidatorType } from "../form-types";
import { i10n } from "../../../config/prime-locale";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";

const validations: ValidatorType[] = [
  { label: 'Account.password.at_least_six_chars', validate: value => value && RegExp(/^.{6,63}$/).test(value) },
  {
    label: 'Account.password.at_least_one_lower_case_char',
    validate: value => value && RegExp(/^(?=.*?[a-z])/).test(value)
  },
  { label: 'Account.password.at_least_one_upper_case_char', validate: value => RegExp(/^(?=.*?[A-Z])/).test(value) },
  { label: 'Account.password.at_least_one_digit_char', validate: value => RegExp(/^(?=.*?[0-9])/).test(value) }]

type PasswordInputProps = FieldType & {
  onChange?: (_: any) => void
}

/**
 * The password component can be used to add a password input with
 * the password requirements displayed.
 */
export const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [field, errors, onChange] = useInputField({
    onChange: props.onChange, field: {
      id: 'password',
      required: true,
      validators: validations
    }
  })

  if (!field) return <>''</>
  return <>
    <div className="flex flex-col gap-2 mt-2">
      <label htmlFor={ props.id } className='font-bold'
             data-testid={ `${ props.id }-label` }>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>
      <IconField iconPosition='left' className='[&.p-icon-field>.p-inputtext]:w-full'>
        <InputIcon className={ 'pi pi-lock' }/>
        <InputText id={ props.id }
                   type='password'
                   defaultValue={ field.value || props.value }
                   required={ props.required }
                   pattern={ props.pattern }
                   data-testid={ `${ props.id }-input` }
                   invalid={ field.touched ? errors.length > 0 : undefined }
                   onChange={ onChange }/>
      </IconField>
    </div>

    <div className='py-4 px-2 my-3 mx-2 rounded-sm border-solid border-[1px] border-separator shadow-xl'>
      { validations.map(rule => {
        const invalid = errors.indexOf(rule.label) > -1
        return <div key={ rule.label }
                    className={ `flex gap-2
                                            ${ invalid ? 'text-dark-warning' : 'text-dark-success' }` }>
          { invalid && <Icon path={ mdiAlertCircle } size={ .8 } className='mt-0.5'/> }
          { !invalid && <Icon path={ mdiCheck } size={ .8 } className='mt-0.5'/> }
          { i10n(rule.label) }
        </div>
      }) }
    </div>
  </>
}
