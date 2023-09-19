import {useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import React, {FC} from "react";

import {Translation} from "../Translation";
import {StyleVariant} from "../types";

const specialVariant = ['icon', 'text']
type SpecializedVariant = (typeof specialVariant)[number]
const isSpecializedVariant = (x: any): x is SpecializedVariant => specialVariant.includes(x)

export type ButtonProps  = {
    label?: string,
    message?: string,
    // The href that will be navigated to when the button is clicked, ignored if `onClick` is set
    href?: string,
    // The click handler function that will be called if the button is clicked
    onClick?: () => void,
    // The type of the button, defaults to 'button'
    type?: 'button' | 'submit' | 'reset',
    // The styling of the button, defaults to 'primary'
    variant?: SpecializedVariant | StyleVariant,
    variantType?: 'outline' | '',
    // Any additional class to be applied to the button
    className?: string,
    // Indicator if the button should be disabled or not
    disabled?: boolean,
    icon?: any,
    iconPos?: 'after' | 'before'
}

const Button: FC<ButtonProps> = ({
                                     label,
                                     href,
                                     message,
                                     type = 'button',
                                     variant = 'primary',
                                     variantType = '',
                                     className = '',
                                     disabled,
                                     icon,
                                     iconPos,
                                     onClick = () => undefined
                                 }) => {
    const navigate = useNavigate()
    const specialVariant = isSpecializedVariant(variant)

    return <>
        {/* border-primary border-secondary border-success border-info border-warning */}
        {/* bg-dark-primary bg-dark-secondary bg-dark-success bg-dark-info bg-dark-warning */}
        <button
            type={type}
            onClick={() => (href && navigate(href)) || onClick()}
            className={`whitespace-nowrap outline-none
                        flex items-center justify-center cursor-pointer
                        hover:brightness-125
                        text-sm gap-1 ${variantType}
                        ${disabled ? 'pointer-events-none opacity-60' : ''}
                        ${specialVariant 
                            ? 'border-none hover:border-b-primary hover:underline text-primary'
                            : `px-2 py-1 border-solid border-[1px] rounded border-${variant} bg-dark-${variant} text-white`
                        }
                        ${className}`}
            disabled={disabled}>
            {iconPos !== 'after' && <Icon className='before' path={icon} size={.8}/>}
            {label && <Translation label={label}/>}
            {!label && message}
            {iconPos === 'after' && <Icon className='after' path={icon} size={.8}/>}
        </button>
    </>
}

export default Button
