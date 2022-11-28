import PropTypes from 'prop-types';

import {InputGroup, InputValidationErrors, useInputField} from "./AbstractInput";

export const TextInput = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <input id={field.id}
                   name={field.id}
                   value={field.value}
                   required={props.required}
                   pattern={props.pattern}
                   readOnly={props.readonly}
                   onChange={onChange}
                   minLength={props.minLength}
                   maxLength={props.maxLength}
                   type={props.type}/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}
TextInput.propTypes = {
    ...InputGroup.propTypes,
    // The value of the input field
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    // The minimum length of a text input
    minLength: PropTypes.number,
    // The maximum length of a text input
    maxLength: PropTypes.number,
    // The type of input to use, can be any of text | number | password
    type: PropTypes.oneOf(['number', 'text', 'password']),
    // Any pattern validation that should be applied
    pattern: PropTypes.string,
    // Any minimum value validation, only valid for type = 'number'
    min: PropTypes.number,
    // A change handle that will receive a value changes
    onChange: PropTypes.func,
}
