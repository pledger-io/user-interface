import React, { FC } from "react";

import { InputValidationErrors, useInputField } from "./InputGroup";
import { FieldType } from "../form-types";
import { i10n } from "../../../config/prime-locale";
import { InputTextarea } from "primereact/inputtextarea";

type TextAreaProps = FieldType & {
    title?: string,
    help?: string,
    onChange?: (_: any) => void
}

/**
 * A text area that is bound to the form context it is in.
 */
export const TextArea: FC<TextAreaProps> = (props) => {
    const [field, errors, onChange, onBlur] = useInputField({ onChange: props.onChange, field: props })

    if (!field) return <>props.id</>

    return <>
        <div className="flex flex-col gap-2 mt-2">
            <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>
            <InputTextarea id={ props.id }
                           name={ props.id }
                           required={ props.required }
                           onChange={ onChange }
                           onBlur={ onBlur }
                           defaultValue={ field.value || props.value }/>
        </div>

        { field.touched && <InputValidationErrors field={ field } errors={ errors }/> }
    </>
}
