import React, {FC} from "react";
import {useInputField} from "./InputGroup";
import {FieldType} from "../form-types";

type HiddenInputProps = FieldType & {
    onChange: (value: string) => void
}

/**
 * The hidden input component will add a field to the form that is not visible to the user.
 */
export const HiddenInput: FC<HiddenInputProps> = (props) => {
    const [field] = useInputField({onChange: props.onChange, field: props})

    if (!field) return <>props.id</>
    return <>
        <input type='hidden' id={props.id} name={props.id} value={(field as FieldType).value}/>
    </>
}
