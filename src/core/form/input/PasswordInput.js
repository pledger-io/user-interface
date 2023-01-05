import React from "react";

import {Translation} from "../../Translation";
import Icon from "@mdi/react";
import {mdiAlertCircle, mdiCheck} from "@mdi/js";
import {InputGroup, useInputField} from "./InputGroup";

const validations = [
    {label: 'Account.password.at_least_six_chars',validate: value => RegExp(/^.{6,63}$/).test(value)},
    {label: 'Account.password.at_least_one_lower_case_char',validate: value => RegExp(/^(?=.*?[a-z])/).test(value)},
    {label: 'Account.password.at_least_one_upper_case_char',validate: value => RegExp(/^(?=.*?[A-Z])/).test(value)},
    {label: 'Account.password.at_least_one_digit_char',validate: value => RegExp(/^(?=.*?[0-9])/).test(value)}]

/**
 * The password component can be used to add a password input with
 * the password requirements displayed.
 */
export const PasswordInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: {
        id: 'password',
        required: true,
        validators: validations}})

    if (!field) return ''
    return (
        <div>
            <InputGroup id='password'
                        required
                        title='UserAccount.password'
                        valid={field.touched ? errors.length === 0 : undefined }>
                <input type='password'
                       id='password'
                       name='password'
                       onChange={onChange}/>
            </InputGroup>
            <div className='Validation-Rules'>
                {validations.map(rule => {
                    const invalid = errors.indexOf(rule.label) > -1
                    return <div key={rule.label}
                                className={`Rule ${invalid ? 'invalid' : 'valid'}`}>
                        { invalid && <Icon path={mdiAlertCircle} size={.8}/> }
                        { !invalid && <Icon path={mdiCheck} size={.8}/> }
                        <Translation label={rule.label}/>
                    </div>
                })}
            </div>
        </div>
    )
}
