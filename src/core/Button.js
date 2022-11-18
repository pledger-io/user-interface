import React from 'react';
import PropTypes from 'prop-types';
import Icon from "@mdi/react";
import {Translation} from "./Translation";
import {withNavigation} from "./hooks";

const ButtonPropTypes = {
    // The click handler function that will be called if the button is clicked
    onClick: PropTypes.func,
    // The href that will be navigated to when the button is clicked, ignored if `onClick` is set
    href: PropTypes.string,
    // The styling of the button
    variant: PropTypes.oneOf(['text', 'success', 'primary', 'warning', 'info', 'icon']),
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

class Button extends React.Component {
    static propTypes = ButtonPropTypes

    constructor(props, context) {
        super(props, context);

        const {onClick} = props;
        this.state = {
            onClick: onClick ? onClick : this.navigate.bind(this)
        }
    }

    navigate() {
        const {href, navigate} = this.props;
        if (href) {
            navigate(href);
        }
    }

    render() {
        const {disabled, type = 'button', variant = '', variantType = '', className = ''} = this.props
        const classes = `Button ${variant} ${variantType} ${className}`;

        return (
            <button
                type={type}
                onClick={() => this.state.onClick()}
                className={classes}
                disabled={disabled}>
                {this.renderIcon('before')}
                {this.renderLabel()}
                {this.renderIcon('after')}
            </button>
        )
    }

    renderIcon(position) {
        const {icon = null, iconPos = 'before'} = this.props

        if (icon !== null && iconPos === position) {
            return <Icon path={icon} size={.8}/>
        }

        return null
    }

    renderLabel() {
        const {label = null, message = null} = this.props

        if (label !== null) {
            return <Translation label={label}/>
        } else if (message !== null) {
            return message
        }

        return null
    }
}

class HistoryButton extends React.Component {
    static propTypes = {
        // The variant to be applied to the button
        style: PropTypes.oneOf(['primary', 'warning', 'icon', 'text']),
        // The icon to be displayed in the button
        icon: PropTypes.any,
        // The translation key to be used
        label: PropTypes.string
    }

    render() {
        const {style = '', icon, label} = this.props
        const classes = 'Button ' + (style || '');

        return <button
            type='button'
            className={classes}
            onClick={this.onClick.bind(this)}>
            <Icon path={icon}
                  size={.8}/>
            <Translation label={label}/>
        </button>
    }

    onClick() {
        const {navigate} = this.props
        navigate(-1)
    }
}

const buttonWithNav = withNavigation(Button)
const historyBtnWithNav = withNavigation(HistoryButton)

export {
    ButtonPropTypes,
    buttonWithNav as Button,
    historyBtnWithNav as BackButton
}
