import React, { createContext, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

/**
 * @deprecated
 */
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

