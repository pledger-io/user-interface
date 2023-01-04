import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {createContext, useContext, useEffect, useState} from "react";

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
    }, [value])

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
    }, [value])

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
    }, [searchParams])

    return [value]
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
