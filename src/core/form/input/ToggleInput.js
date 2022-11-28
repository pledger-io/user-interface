import React, {useContext, useState} from "react";
import {FormContext} from "../Form";

export const ToggleInput = ({id, value, onChange = value => undefined}) => {
    const formContext           = useContext(FormContext)
    const [checked, setChecked] = useState(value)

    const onChangeValue = () => setChecked(!checked) || onChange(!checked)

    return (
        <div className='Switch'>
            <input name={id} id={id} defaultChecked={checked} type='checkbox'/>
            <label htmlFor={id} onClick={onChangeValue}/>
        </div>
    )
}

