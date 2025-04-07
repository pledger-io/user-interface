import { AxiosError } from "axios";
import { Toast } from "primereact/toast";
import React, { createContext, FC, ReactNode, use, useMemo, useRef } from "react";
import { i10n } from "../config/prime-locale";
import { ApiError } from "../types/types";

type NotificationContextType = {
  warning: (message: string) => void
  error: (message: string) => void
  success: (message: string) => void
  httpError: (e: AxiosError) => void
}

type NotificationContextProviderProps = {
  children: ReactNode | ReactNode[]
}
type Severity = "success" | "info" | "warn" | "error" | "secondary" | "contrast";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: FC<NotificationContextProviderProps> = ({ children }) => {
  const toast = useRef<Toast>(null)

  const showToast = (severity: Severity, message: string) => {
    toast.current?.show({
      severity: severity,
      detail: i10n(message),
      life: 5000
    })
  }

  const axiosError = (error: AxiosError) => {
    const apiError: ApiError = error.response?.data as ApiError
    if (apiError?._links.help) {
      showToast('warn', apiError._links.help[0].href)
    } else {
      toast.current?.show({
        severity: 'error',
        detail: (error.response as any).data.message,
        life: 5000
      })
    }
  }

  const context = useMemo(() => ({
    warning: (message: string) => showToast('warn', message),
    error: (message: string) => showToast('error', message),
    success: (message: string) => showToast('success', message),
    httpError: axiosError
  }), [])

  return <NotificationContext value={ context }>
    <Toast position='top-right' ref={ toast } />
    { children }
  </NotificationContext>
}


export const useNotification = () => {
  const context = use(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
