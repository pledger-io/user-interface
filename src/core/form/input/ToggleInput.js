import React, {useState} from "react";
import {useInputField} from "./InputGroup";
import PropTypes from "prop-types";

export const ToggleInput = (props) => {
    const [field, _, onChange] = useInputField({onChange: props.onChange, field: props})
    const [checked, setChecked] = useState(props.value || false)

    const onToggle = () => onChange({persist: () => {}, currentTarget: {value: !checked}}) || setChecked(!checked)

    if (!field) return <></>
    return (
        <div className={`Switch ${props.className}`}>
            <input name={props.id} id={props.id} defaultChecked={checked} type='checkbox'/>
            <label htmlFor={props.id} onClick={onToggle}/>
        </div>
    )
}
ToggleInput.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    className: PropTypes.string
}

