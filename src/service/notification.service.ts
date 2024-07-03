import { AxiosError } from "axios";
import { ApiError } from "../core/types";
import { Resolver } from "../core";

export type NotificationEvent = {
    type: 'success' | 'warning',
    label?: string
    message?: string,
    id?: string
}

const NotificationService = (() => {
    const push  = (messageKey: string, style: 'warning' | 'success') => {
        notifyUser({ type: style, label: messageKey })
    }
    const handleException = (error: AxiosError) => {
        const apiError: ApiError = error.response?.data as ApiError
        if (apiError?._links.help) {
            push(apiError._links.help[0].href, 'warning')
        } else {
            notifyUser({ type: 'warning', message: (error.response as any).data.message })
        }
    }

    return {
        warning: (messageKey: string) => push(messageKey, 'warning'),
        success: (messageKey: string) => push(messageKey, 'success'),
        exception: (e: AxiosError) => handleException(e),
        push: push
    }
})()

const notifyUser = (event: NotificationEvent) => {
    event.id = Resolver.uuid()
    window.dispatchEvent(new CustomEvent('notification', { detail: event }))
}

export default NotificationService