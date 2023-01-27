import React from 'react';
import PropTypes from 'prop-types';
import Icon from "@mdi/react";
import {Translation} from "./Translation";
import {useNavigate} from "react-router-dom";

const Button = ({label, href, message, type = 'button', variant = 'primary', variantType = '', disabled, icon, iconPos, onClick = () => undefined}) => {
    const navigate = useNavigate()

    return (
        <button
            type={type}
            onClick={() => (href && navigate(href)) || onClick()}
            className={`Button ${variant} ${variantType}`}
            disabled={disabled}>
            {iconPos !== 'after' && <Icon className='before' path={icon} size={.8}/>}
            {label && <Translation label={label}/>}
            {!label && message}
            {iconPos === 'after' && <Icon className='after' path={icon} size={.8}/>}
        </button>
    )
}
Button.propTypes = {
    // The click handler function that will be called if the button is clicked
    onClick: PropTypes.func,
    // The href that will be navigated to when the button is clicked, ignored if `onClick` is set
    href: PropTypes.string,
    // The styling of the button
    variant: PropTypes.oneOf(['text', 'success', 'primary', 'secondary', 'warning', 'info', 'icon']),
    variantType: PropTypes.oneOf(['', 'outline']),
    // Any classes that should be appended
    className: PropTypes.string,
    // Indicator if the button should be disabled or not
    disabled: PropTypes.bool,
    // The icon to be displayed in the button
    icon: PropTypes.any,
    // The position of the icon, before or after the text
    iconPos: PropTypes.oneOf(['before', 'after']),
    // The translation text key to be used
    label: PropTypes.string,
    message: PropTypes.string,
    // The type of button, defaults to 'button'
    type: PropTypes.oneOf(['button', 'submit', 'cancel'])
}

const HistoryButton = ({style = '', icon, label}) => {
    const navigate = useNavigate()

    return (
        <button
            type='button'
            className={`Button ${style}`}
            onClick={() => navigate(-1)}>
            <Icon path={icon} size={.8}/>
            <Translation label={label}/>
        </button>)
}
HistoryButton.propTypes = {
    // The variant to be applied to the button
    style: PropTypes.oneOf(['primary', 'warning', 'icon', 'text']),
    // The icon to be displayed in the button
    icon: PropTypes.any,
    // The translation key to be used
    label: PropTypes.string
}

export {
    Button,
    HistoryButton as BackButton
}
