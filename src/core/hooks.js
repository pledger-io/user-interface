import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {createContext, useContext, useEffect, useState} from "react";
import {Ranges} from "./Dates";

/**
 * Binds a value to the localstorage, fetching it from localstorage if present. Or else using the initialValue
 * argument.
 */
export const useLocalStorage = (key, initialValue) => {
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

export const useLocalStorageJson = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        return JSON.parse(localStorage.getItem(key)) || (() => {
            if (initialValue instanceof Function) return initialValue()
            return initialValue
        })()
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}

/**
 *
 * @returns {[string]}
 */
export const useQueryParam = (key, initialValue) => {
    const [value, setValue] = useState(initialValue)
    const [searchParams]    = useSearchParams()

    useEffect(() => {
        if (searchParams.has(key) && searchParams.get(key) !== value) setValue(searchParams.get(key))
        else if (!searchParams.has(key)) setValue(initialValue)
    }, [searchParams, initialValue, key, value])

    return [value]
}

/**
 * Consume a range from the path params {@code year} and {@code month}.
 * @returns {[Range]}
 */
export const useDateRange = () => {
    const {year, month}       = useParams()
    const [range, setRange]   = useState(() => Ranges.currentMonth())

    useEffect(() => {
        if (year && month) setRange(Ranges.forMonth(year, month))
    }, [year, month])

    return [range]
}

/**
 * @deprecated
 */
export function withNavigation(Component) {
    return props => <Component {...props} navigate={useNavigate()}/>;
}

export const QueryContext = createContext({
    resolved: null
})

export const PathParams = createContext({
    resolved: params => {},
    parameters: {}
})

export const withPathParams = (Component) => props => {
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

export function withQueryContext(Component) {
    return props => {
        const queryContext = useContext(QueryContext);
        const [searchParams] = useSearchParams();

        useEffect(() => {
            queryContext.resolved(Object.fromEntries(searchParams));
        }, [searchParams, queryContext])

        return (
            <QueryContext.Provider value={queryContext}>
                <Component {...props} queryContext={queryContext}/>
            </QueryContext.Provider>
        )
    }
}
