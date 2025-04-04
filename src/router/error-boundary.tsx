import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
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

  const isNotRouterError = !isRouteErrorResponse(error)
  const statusCode = (error as any)?.response?.status
  if (isNotRouterError && statusCode === 403) {
    console.debug('Forbidden error thrown in a router processing, redirecting to two-factor authentication page.')
    setTimeout(() => navigate('/two-factor'), 0)
    return <></>
  } else if (isNotRouterError && statusCode === 401) {
    console.debug('Unauthorized error thrown in a router processing, logging out user and reloading page.')
    SecurityRepository.logout()
    setTimeout(() => navigate(0), 0)
    return <></>
  }

  console.warn('Unexpected error thrown in a router processing.', error)
  return <><strong data-testid='error-message'>Error: { (error as any)?.message }</strong></>
}
