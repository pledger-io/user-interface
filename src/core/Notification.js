import React from "react";

import '../assets/css/NotificationCenter.scss'
import {Translation} from "./Translation";

class Notification extends React.Component {

    render() {
        const {style, message} = this.props

        return (
            <div className={`Notification ${style}`}>
                <Translation label={message} />
                <div className='CountDown' />
            </div>
        );
    }
}

let notificationId = 0;
class NotificationService {
    notifications = []
    handler= notifications => {}

    warning(messageKey) {
        this.push(messageKey, 'warning')
    }

    success(messageKey) {
        this.push(messageKey, 'success')
    }

    remove(notification) {
        this.notifications = this.notifications
            .filter(existing => existing !== notification)
        this.handler(this.notifications)
    }

    push(messageKey, style) {
        const notification = <Notification style={style} message={messageKey} key={++notificationId} />
        setTimeout(() => this.remove(notification), 2000)
        this.notifications.push(notification)
        this.handler(this.notifications)
    }
}

const notificationService = new NotificationService();
class NotificationCenter extends React.Component {
    state = {
        notifications: []
    }

    constructor(props, context) {
        super(props, context);

        notificationService.handler = notification => {
            this.setState({
                notifications: notification
            })
        }
    }

    render() {
        return (
            <div className='NotificationCenter'>
                {this.state.notifications}
            </div>
        );
    }
}

export {
    notificationService as Service,
    NotificationCenter
}
