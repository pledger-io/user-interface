import {LoaderFunctionArgs, redirect} from "react-router";
import SecurityRepository from "../core/repositories/security-repository";
import RestAPI from "../core/repositories/rest-api";
import {CurrencyRepository} from "../core/RestAPI";

/**
 * Performs an authenticated loading operation. This method takes a LoaderFunctionArgs object as a parameter.
 * It constructs parameters using the request URL, checks if the user is authenticated through SecurityRepository,
 * and redirects to the login page if not authenticated. It then fetches user profile and currency information
 * using RestAPI and CurrencyRepository respectively, and returns the user profile object.
 *
 * @param {LoaderFunctionArgs} LoaderFunctionArgs - The argument object containing request information.
 *
 * @return {Object} Returns user profile object upon successful loading operation.
 */
export async function authenticatedLoader({ request }: LoaderFunctionArgs): Promise<{ user: any } | Response> {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname.replace("/ui", ""));
    if (!SecurityRepository.isAuthenticated()) {
        return redirect("/login?" + params.toString());
    }

    await RestAPI.profile()
    const profile = RestAPI.user() as any
    await CurrencyRepository.list()
    profile.defaultCurrency = CurrencyRepository.cached(profile.currency)
    return {
        user: profile
    }
}