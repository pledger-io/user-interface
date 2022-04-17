import React from "react";

import {Translation} from "../../Translation";
import {When} from "../../index";
import Icon from "@mdi/react";
import {mdiAlertCircle, mdiCheck} from "@mdi/js";
import {FormContext} from "../Form";

/**
 * The password component can be used to add a password input with
 * the password requirements displayed.
 */
export class PasswordInput extends React.Component {
    static contextType = FormContext

    state = {
        validations: [
            {label: 'Account.password.at_least_six_chars',validate: value => RegExp(/^.{6,63}$/).test(value)},
            {label: 'Account.password.at_least_one_lower_case_char',validate: value => RegExp(/^(?=.*?[a-z])/).test(value)},
            {label: 'Account.password.at_least_one_upper_case_char',validate: value => RegExp(/^(?=.*?[A-Z])/).test(value)},
            {label: 'Account.password.at_least_one_digit_char',validate: value => RegExp(/^(?=.*?[0-9])/).test(value)}]
    }

    constructor(props, context) {
        super(props, context);

        context.addField({
            field: {
                id: 'password',
                required: true,
                validators: this.state.validations
            },
            value: ''
        })
    }

    render() {
        const {password} = this.context.fields
        const errors = this.context.errors['password'] || []

        let validInvalid = ''
        if (password?.touched) {
            if (this.context.errors['password']?.length === 0) {
                validInvalid = 'valid'
            } else {
                validInvalid = 'invalid'
            }
        }

        return (
            <div>
                <div className={`Input Required ${validInvalid}`}>
                    <label><Translation label='UserAccount.password'/></label>
                    <div>
                        <input type='password'
                               id='password'
                               name='password'
                               onChange={event => this.context.onChange(event, this.context.fields['password'])}/>
                    </div>
                </div>
                <div className='Validation-Rules'>
                    {this.state.validations
                        .map(rule => {
                            const invalid = errors.indexOf(rule.label) > -1
                            return <div key={rule.label}
                                        className={`Rule ${invalid ? 'invalid' : 'valid'}`}>
                                <When condition={invalid}>
                                    <Icon path={mdiAlertCircle} size={.8}/>
                                </When>
                                <When condition={!invalid}>
                                    <Icon path={mdiCheck} size={.8}/>
                                </When>
                                <Translation label={rule.label}/>
                            </div>
                        })}
                </div>
            </div>
        )
    }
}
