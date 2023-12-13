import React from "react";
import { useInputField } from "./InputGroup";
import PropTypes from "prop-types";

type ToggleInputProps = {
    id: string,
    onChange?: (_: string) => void,
    value?: boolean,
    className?: string
}

export const ToggleInput = (props: ToggleInputProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [field, _, onChange] = useInputField({ onChange: props.onChange, field: props })

    const onToggle = () => {
        const value = field.value === undefined ? true : !field.value
        onChange({
            persist: () => {},
            currentTarget: {
                value: value
            }
        })
    }

    if (!field) return <></>
    return (
        <div className={ `w-8 h-5 ${props.className} cursor-pointer
                         rounded-full ${field.value ? 'bg-lime-500' : 'bg-gray-500'}
                         relative` }
             onClick={ onToggle }>
            <label htmlFor={ props.id }
                   className={`absolute h-4 w-4 bg-white rounded-full top-0.5 left-0.5 
                               transition-all duration-300
                               ${field.value ? 'translate-x-3' : ''}`} />
        </div>
    )
}
ToggleInput.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.bool,
    className: PropTypes.string
}

