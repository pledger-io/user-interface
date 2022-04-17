import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {createContext, useContext, useEffect} from "react";

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
