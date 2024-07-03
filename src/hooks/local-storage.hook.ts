import { useEffect, useState } from "react";

/**
 * Binds a value to the localstorage, fetching it from localstorage if present. Or else using the initialValue
 * argument.
 */
const useLocalStorage = (key: string, initialValue: string | (() => string)) => {
    const [value, setValue] = useState<string>((): string => {
        const existing = localStorage.getItem(key)
        if (existing) return existing

        if (initialValue instanceof Function) return initialValue()
        return initialValue
    })

    useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key])

    return [value, setValue]
}

export default useLocalStorage
