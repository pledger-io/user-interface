import React, { FC } from "react";

import { InputGroup, InputValidationErrors, useInputField } from "./InputGroup";
import { FieldType } from "../form-types";

type TextAreaProps = FieldType & {
    title?: string,
    help?: string,
    onChange?: (_: any) => void
}

/**
 * A text area that is bound to the form context it is in.
 */
export const TextArea: FC<TextAreaProps> = (props) => {
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })

    if (!field) return <>props.id</>
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <textarea id={field.id}
                      name={field.id}
                      defaultValue={field && props.value}
                      required={props.required}
                      onChange={onChange}/>

            {field.touched && <InputValidationErrors field={field} errors={errors} />}
        </InputGroup>
    )
}