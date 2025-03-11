import { LoaderFunctionArgs, redirect } from "react-router";
import SecurityRepository from "../core/repositories/security-repository";

/**
 * Loads an anonymous user based on the provided request.
 *
 * @param {LoaderFunctionArgs} request - The request object containing URL information.
 */
export function anonymousLoader({ request }: LoaderFunctionArgs): Response | null {
    const [from] = new URLSearchParams(request.url).get("from") || "/dashboard"
    if (SecurityRepository.isAuthenticated()) {
        return redirect(from);
    }
    return null;
}
