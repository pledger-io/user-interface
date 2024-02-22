import axios, { AxiosResponse } from "axios";

const config = {
    root: '/api'
}

const axiosInstance = axios.create({
    baseURL: config.root,
    timeout: 10000,
    transformRequest: (data, headers) => {
        if (sessionStorage.getItem('token')) {
            headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
        }
        if (!headers.hasLanguage && localStorage.getItem('language')) {
            headers['Accept-Language'] = localStorage.getItem('language')
        }

        if (!headers['Content-Type'] || headers['Content-Type'] === 'application/json') {
            headers['Content-Type'] = 'application/json'
            return JSON.stringify(data)
        }
        return data
    },
    transformResponse: (data, headers, status) => {
        if (status === 401 && sessionStorage.getItem('token')) {
            window.dispatchEvent(new Event('credentials-expired'))
            return null
        }

        if (headers['content-type'] === 'application/json') {
            return JSON.parse(data)
        }

        return data
    },
})

const RestAPI = (() => {
    let userProfile = {}
    function updateProfile(profile: any) {
        userProfile = profile

        document.body.classList.remove('dark', 'navy')
        document.body.classList.add(profile.theme)

        return profile
    }

    const handle = (response: Promise<AxiosResponse>) => response.then(response => response.data)

    const api = {
        profile: () => api.get('profile').then(updateProfile),
        user: () => userProfile,

        get:   <U>(uri: string, settings = {}): Promise<U>              => handle(axiosInstance.get(uri, settings)),
        patch: <T,U>(uri: string, body: T, settings = {}): Promise<U>   => handle(axiosInstance.patch(uri, body, settings)),
        post:  <T,U>(uri: string, body: T, settings = {}): Promise<U>   => handle(axiosInstance.post(uri, body, settings)),
        put:   <T,U>(uri: string, body: T, settings = {}): Promise<U>   => handle(axiosInstance.put(uri, body, settings)),
        delete: (uri: string, settings = {}): Promise<void>             => handle(axiosInstance.delete(uri, settings))
    }

    if (sessionStorage.getItem('token')) api.profile().finally(() => {})

    return api
})()

export default RestAPI