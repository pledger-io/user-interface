import React, {useEffect, useState} from "react";

import '../assets/css/NotificationCenter.scss'
import {Translation} from "./Translation";
import PropTypes from "prop-types";

const NotificationService = (() => {
    let notifications  = []
    let notificationId = 0;
    let callback       = notifications => undefined

    const notify = updated => {
        notifications = updated
        callback(notifications)
    }

    return {
        warning: messageKey => this.push(messageKey, 'warning'),
        success: messageKey => this.push(messageKey, 'success'),
        remove: notification => notify(notifications.filter(existing => existing !== notification)),
        push: (messageKey, style) => {
            const notification = <Notification style={style} message={messageKey} key={++notificationId} />
            setTimeout(() => this.remove(notification), 2000)
            notifications.push(notification)
            notify(notifications)
        },

        handler: handler => callback = handler
    }
})()

const Notification = ({style, message}) => {
    return (
        <div className={`Notification ${style}`}>
            <Translation label={message} />
            <div className='CountDown' />
        </div>
    );
}
Notification.propTypes = {
    // The style to apply on the message
    style: PropTypes.oneOf(['warning', 'success']),
    // the message key to display
    message: PropTypes.string
}


const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        NotificationService.handler(setNotifications)
    }, [])

    return <div className='NotificationCenter'>{notifications}</div>
}


export {
    NotificationService as Service,
    NotificationCenter
}
