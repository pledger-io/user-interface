import {FC} from "react";
import {InputGroup, InputValidationErrors, useInputField} from "./InputGroup";
import {FieldType} from "../form-types";

type TextInputProps = FieldType & {
    type: 'number' | 'text' | 'password',
    title?: string,
    help?: string,
    minLength?: number
    maxLength?: number,
    pattern?: string,
    readonly?: boolean,
    onChange?: (_: any) => void
}

export const TextInput: FC<TextInputProps> = (props) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    if (!field) return <>props.id</>
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <input id={field.id}
                   name={field.id}
                   defaultValue={field.value || props.value}
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
