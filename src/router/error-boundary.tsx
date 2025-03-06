import {isRouteErrorResponse, useNavigate, useRouteError} from "react-router";
import SecurityRepository from "../core/repositories/security-repository";

/**
 * RootErrorBoundary function handles errors that occur during routing in the application's root level.
 * It checks for specific error status codes and handles them accordingly by redirecting or logout the user.
 * If an unexpected error occurs, a warning message is logged to the console.
 *
 * @return Always returns an empty JSX element <></>.
 */
export function RootErrorBoundary() {
    const error = useRouteError()
    const navigate = useNavigate()

    if (!isRouteErrorResponse(error) && (error as any)?.response?.status === 403) {
        // todo this does not work. Need to figure out a way to do a proper route redirect
        navigate('/two-factor')
        return <></>
    } else if (!isRouteErrorResponse(error) && (error as any)?.response?.status === 401) {
        SecurityRepository.logout()
        window.location.reload()
        return <></>
    }

    console.warn('Unexpected error thrown in a router processing.', error)
    return <></>
}