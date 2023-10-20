import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {createContext, useContext, useEffect, useState} from "react";
import {Ranges, Range} from "./Dates";

/**
 * Binds a value to the localstorage, fetching it from localstorage if present. Or else using the initialValue
 * argument.
 */
export const useLocalStorage = (key: string, initialValue: string | (() => string)) => {
    const [value, setValue] = useState(() => {
        return localStorage.getItem(key) || (() => {
            if (initialValue instanceof Function) return initialValue()
            return initialValue
        })()
    })

    useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key])

    return [value, setValue]
}

export const useLocalStorageJson = (key: string, initialValue: any) => {
    const [value, setValue] = useState(() => {
        return JSON.parse(localStorage.getItem(key) as string) || (() => {
            if (initialValue instanceof Function) return initialValue()
            return initialValue
        })()
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}

export const useQueryParam = ({key, initialValue}: { initialValue: string | (() => string), key: string }) => {
    const [value, setValue] = useState(initialValue)
    const [searchParams]    = useSearchParams()

    useEffect(() => {
        if (searchParams.has(key) && searchParams.get(key) !== value) setValue(searchParams.get(key) as string)
        else if (!searchParams.has(key)) setValue(initialValue)
    }, [searchParams, initialValue, key, value])

    return [value]
}

/**
 * Consume a range from the path params {@code year} and {@code month}.
 */
export const useDateRange = () : [Range] => {
    const {year, month} = useParams()
    const [range, setRange] = useState(() => Ranges.currentMonth())

    useEffect(() => {
        if (year && month) setRange(Ranges.forMonth(year, month))
    }, [year, month])

    return [range]
}

/**
 * @deprecated
 */
export function withNavigation(Component: any) {
    return (props: any) => <Component {...props} navigate={useNavigate()}/>;
}

export const PathParams = createContext({
    resolved: (_: any) => {},
    parameters: {}
})

export const withPathParams = (Component: any) => (props: any) => {
    const pathContext = useContext(PathParams)
    const pathParams = useParams()

    useEffect(() => {
        pathContext.parameters = pathParams
        pathContext.resolved(pathParams)
    }, [pathParams, pathContext])
    //useEffect(() => pathContext.resolved(pathParams), [])

    return (
        <PathParams.Provider value={pathContext}>
            <Component {...props} pathContext={pathContext} />
        </PathParams.Provider>
    )
}

