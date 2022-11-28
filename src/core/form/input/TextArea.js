import React from "react";

import {InputGroup, InputValidationErrors, useInputField} from "./AbstractInput";

/**
 * A text area that is bound to the form context it is in.
 */
export const TextArea = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <textarea id={field.id}
                      name={field.id}
                      value={field && props.value}
                      required={props.required}
                      onChange={onChange}/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}
TextArea.propTypes = {
    ...InputGroup.propTypes
}
