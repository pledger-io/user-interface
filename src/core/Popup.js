import React, {createContext} from "react";
import PropTypes from 'prop-types';
import {mdiCancel, mdiClose, mdiRadioboxBlank} from "@mdi/js";

import {Translation} from "./Translation";
import {Buttons} from "./index";

import '../assets/css/Popup.scss'

export const PopupContext = createContext({
    close: () => {},
    open: () => {}
})

class Popup extends React.Component {
    static contextType = PopupContext
    static propTypes = {
        // The components that will be added to the footer of the popup
        actions: PropTypes.any,
        // The translation key that is used in the header of the popup
        title: PropTypes.string.isRequired,
        className: PropTypes.string,
    }

    state = {
        closed: true
    }

    constructor(props, context) {
        super(props, context);

        this.context.close = () => this.close();
        this.context.open = () => this.open();
    }

    render() {
        const {title, className = ''} = this.props
        const {closed} = this.state

        if (closed) {
            return ''
        }

        return (
            <span className={`Popup ${className}`}>
                <div className='Dialog'>
                    <header>
                        <Translation label={title}/>
                        <Buttons.Button icon={mdiClose}
                                onClick={this.close.bind(this)}
                                variant='icon'
                                className='secondary'/>
                    </header>
                    <section>
                        {this.props.children}
                    </section>
                    {this.getFooter()}
                </div>
            </span>
        )
    }

    open() {
        this.setState({
            closed: false
        })
    }

    close() {
        this.setState({
            closed: true
        })
    }

    getFooter() {
        const {actions} = this.props;
        if (actions) {
            return <footer>{actions}</footer>
        }

        return '';
    }
}

export class Dialog extends React.Component {
    static propTypes = {
        // The translation key that is used in the header of the popup
        title: PropTypes.string.isRequired,
        openButton: PropTypes.element,
        className: PropTypes.string,
        actions: PropTypes.arrayOf(PropTypes.element),
        control: PropTypes.shape({
            close: () => {}
        })
    }

    popupContext = {open: () => {}, close: () => {}};


    constructor(props, context) {
        super(props, context);

        if (props.hasOwnProperty('control')) {
            props.control.close = () => this.popupContext.close()
        }
    }

    render() {
        const {openButton, title, children, actions = [], className = ''} = this.props
        const actionsWithClose = [...actions, <Buttons.Button key='cancel'
                                                              label='common.action.cancel'
                                                              onClick={() => this.popupContext.close()}
                                                              icon={mdiCancel}/>]

        return (
            <PopupContext.Provider value={this.popupContext}>
                <Buttons.Button {...openButton.props} onClick={() => this.popupContext.open()} />
                <Popup title={title} className={className} actions={actionsWithClose}>
                    {children}
                </Popup>
            </PopupContext.Provider>
        )
    }
}

export class ConfirmPopup extends React.Component {
    static propTypes = {
        // The translation key that is used in the header of the popup
        title: PropTypes.string.isRequired,
        // The callback handler that is used when the user accepts the popup
        onConfirm: PropTypes.func.isRequired
    }

    popupContext = {open: () => {}, close: () => {}};

    render() {
        const {onConfirm = () => {}, openButton} = this.props
        const closeAndConfirm = () => {
            this.popupContext.close()
            onConfirm();
        }

        return (
            <PopupContext.Provider value={this.popupContext}>
                <Buttons.Button {...openButton.props} onClick={() => this.popupContext.open()} />
                <Popup {...this.props}
                       actions={[
                           <Buttons.Button label='common.action.confirm'
                                   key='confirm'
                                   variant='warning'
                                   onClick={() => closeAndConfirm()}
                                   icon={mdiRadioboxBlank}/>,
                           <Buttons.Button label='common.action.cancel'
                                   key='cancel'
                                   variant='secondary'
                                   onClick={() => this.popupContext.close()}
                                   icon={mdiCancel}/>]}>{this.props.children}</Popup>
            </PopupContext.Provider>
        )
    }
}

