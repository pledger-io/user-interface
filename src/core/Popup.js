import React, {createContext, useContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {mdiCancel, mdiClose, mdiRadioboxBlank} from "@mdi/js";

import {Translation} from "./Translation";
import {Buttons} from "./index";

import '../assets/css/Popup.scss'

export const PopupContext = createContext({
    close: () => {},
    open: () => {}
})

export const Popup = ({title, className, actions, children}) => {
    const context             = useContext(PopupContext)
    const [closed, setClosed] = useState(true)

    useEffect(() => {
        context.open = () => setClosed(false)
        context.close = () => setClosed(true)
    }, [context])

    if (closed) {
        return ''
    }

    return (
        <span className={`Popup ${className}`}>
                <div className='Dialog'>
                    <header>
                        <Translation label={title}/>
                        <Buttons.Button icon={mdiClose}
                                        onClick={() => setClosed(true)}
                                        variant='icon'
                                        className='secondary'/>
                    </header>
                    <section>{children}</section>
                    {actions && <footer>{actions}</footer>}
                </div>
            </span>
    )
}
Popup.propTypes = {
    // The components that will be added to the footer of the popup
    actions: PropTypes.any,
    // The translation key that is used in the header of the popup
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
}


export const Dialog = ({control, openButton, title, actions = [], className = '', children}) => {
    useEffect(() => {
        if (control) control.close = () => undefined
    })

    const popupContext = {
        close: () => {},
        open: () => {}
    }
    const actionsWithClose = [...actions, <Buttons.Button key='cancel'
                                                          label='common.action.cancel'
                                                          onClick={() => popupContext.close()}
                                                          icon={mdiCancel}/>]

    return (
        <PopupContext.Provider value={popupContext}>
            <Buttons.Button {...openButton.props} onClick={() => popupContext.open()} />
            <Popup title={title} className={className} actions={actionsWithClose}>
                {children}
            </Popup>
        </PopupContext.Provider>
    )
}
Dialog.propTypes = {
    // The translation key that is used in the header of the popup
    title: PropTypes.string.isRequired,
    openButton: PropTypes.element,
    className: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.element),
    control: PropTypes.shape({
        close: () => {}
    })
}


/**
 * A confirm dialog that can be used to get feedback from the user.
 */
export const ConfirmPopup = (props) => {
    const {openButton, onConfirm = () => undefined, children} = props

    const popupContext = useContext(PopupContext)
    const onConfirmClick = () => popupContext.close() || onConfirm()
    const onCloseClick   = () => popupContext.close()

    return (
        <PopupContext.Provider value={popupContext}>
            <Buttons.Button {...openButton.props} onClick={() => popupContext.open()} />
            <Popup {...props}
                   actions={[
                       <Buttons.Button label='common.action.confirm'
                                       key='confirm'
                                       variant='warning'
                                       onClick={onConfirmClick}
                                       icon={mdiRadioboxBlank}/>,
                       <Buttons.Button label='common.action.cancel'
                                       key='cancel'
                                       variant='secondary'
                                       onClick={onCloseClick}
                                       icon={mdiCancel}/>]}>{children}</Popup>
        </PopupContext.Provider>
    )
}
ConfirmPopup.propTypes = {
    // The translation key that is used in the header of the popup
    title: PropTypes.string.isRequired,
    // The callback handler that is used when the user accepts the popup
    onConfirm: PropTypes.func.isRequired,
    // The button to open the confirm popup
    openButton: PropTypes.any
}

