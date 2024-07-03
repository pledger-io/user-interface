import React, { useEffect, useState } from "react";

import { NotificationEvent } from "../../service/notification.service";

import Notification from "./notification.component";

import '../../assets/css/NotificationCenter.scss'

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<NotificationEvent[]>([])

    useEffect(() => {
        const onNotificationEvent = (event: Event) => {
            const notification = (event as CustomEvent).detail as NotificationEvent

            setTimeout(() => {
                // Remove the notification after 2 seconds
                setNotifications((existing) => {
                    return existing.filter(existing => existing.id !== notification.id)
                })
            }, 2000)
            setNotifications((existing) => {
                return [
                    ...existing,
                    notification
                ]
            })
        }

        window.addEventListener('notification', onNotificationEvent)
        return () => {
            window.removeEventListener('notification', onNotificationEvent)
        }
    }, []);

    return <div className='NotificationCenter'>
        { notifications.map(notification =>
            <Notification key={ notification.id } { ...notification } />) }
    </div>
}

export default NotificationCenter
