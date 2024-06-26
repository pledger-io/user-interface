import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import React, { Attributes, FC } from "react";

import Translation from "../../../core/localization/translation";
import { StyleVariant } from "../../../core/types";

const specialVariant = ['icon', 'text']
type SpecializedVariant = (typeof specialVariant)[number]
const isSpecializedVariant = (x: any): x is SpecializedVariant => specialVariant.includes(x)

export type ButtonProps  = Attributes & {
    label?: string,
    message?: string,
    // The href that will be navigated to when the button is clicked, ignored if `onClick` is set
    href?: string,
    // The click handler function that will be called if the button is clicked
    onClick?: () => void,
    type?: 'button' | 'submit' | 'reset',
    // The styling of the button, defaults to 'primary'
    variant?: SpecializedVariant | StyleVariant,
    variantType?: 'outline' | '',
    // Any additional class to be applied to the button
    className?: string,
    // Indicator if the button should be disabled or not
    disabled?: boolean,
    icon?: any,
    iconPos?: 'after' | 'before',
    dataTestId?: string
}

const ButtonComponent: FC<ButtonProps> = ({
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
                                     onClick = () => undefined,
                                     dataTestId
                                 }) => {
    const navigate = useNavigate()
    const specialVariant = isSpecializedVariant(variant)

    return <>
        {/* border-primary border-secondary border-success border-info border-warning */}
        {/* bg-dark-primary bg-dark-secondary bg-dark-success bg-dark-info bg-dark-warning */}
        <button
            type={type}
            onClick={() => (href && navigate(href)) || onClick()}
            data-testid={ dataTestId }
            className={`whitespace-nowrap outline-none
                        flex items-center justify-center cursor-pointer
                        hover:brightness-125
                        text-sm gap-1 ${variantType}
                        ${disabled ? 'pointer-events-none opacity-60' : ''}
                        ${specialVariant 
                            ? 'border-none hover:border-b-primary hover:underline text-primary'
                            : `px-1.5 md:px-2 py-0 md:py-1 border-solid border-[1px] rounded border-${variant} bg-dark-${variant} text-white`
                        }
                        ${className}`}
            disabled={disabled}>
            {icon && iconPos !== 'after' && <Icon className='before aspect-square w-[1em] md:w-[1.5em]' path={icon}/>}
            {label && <Translation label={label}/>}
            {!label && message}
            {icon && iconPos === 'after' && <Icon className='after aspect-square w-[1em] md:w-[1.5em]' path={icon} />}
        </button>
    </>
}

export default ButtonComponent
