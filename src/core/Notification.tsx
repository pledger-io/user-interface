import React, { ReactElement, useEffect, useState } from "react";

import '../assets/css/NotificationCenter.scss'
import { Translation } from "./localization";
import { AxiosError } from "axios";
import { ApiError } from "./types";
import { Resolver } from "./index";

export type NotificationEvent = {
    type: 'success' | 'warning',
    label?: string
    message?: string,
    id?: string
}

// @deprecated
const NotificationService = (() => {

    const push  = (messageKey: string, style: 'warning' | 'success') => {
        notifyUser({ type: style, label: messageKey })
    }
    const handleException = (error: AxiosError) => {
        const apiError: ApiError = error.response?.data as ApiError
        if (apiError._links.help) {
            push(apiError._links.help[0].href, 'warning')
        } else {
            console.error('Error intercepted', error)
        }
    }

    return {
        warning: (messageKey: string) => push(messageKey, 'warning'),
        success: (messageKey: string) => push(messageKey, 'success'),
        exception: (e: AxiosError) => handleException(e),
        push: push
    }
})()

const Notification = ({ type, message, label } : NotificationEvent) => {
    return (
        <div className={`Notification ${type}`}>
            { label && <Translation label={ label } /> }
            { message && <span>{ message }</span> }
            <div className='CountDown' />
        </div>
    );
}

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

const notifyUser = (event: NotificationEvent) => {
    event.id = Resolver.uuid()
    window.dispatchEvent(new CustomEvent('notification', { detail: event }))
}


export {
    NotificationService as Service,
    NotificationCenter
}
