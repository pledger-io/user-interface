import React from "react";
import {useInputField} from "./InputGroup";
import PropTypes from "prop-types";

/**
 * The hidden input component will add a field to the form that is not visible to the user.
 */
export const HiddenInput = (props) => {
    const [field] = useInputField({onChange: props.onChange, field: props})

    if (!field) return props.id
    return <input type='hidden' id={props.id} name={props.id} value={field.value}/>
}
HiddenInput.propTypes = {
    id: PropTypes.string,
    value: PropTypes.any
}

