import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserProfile } from "../../types/types";

const config = {
    root: '/v2/api'
}

const axiosInstance = axios.create({
    baseURL: config.root,
    timeout: 1200000,
    paramsSerializer: {
      indexes: null
    },
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

        const isJson = headers['content-type'] === 'application/json'
            && headers['content-disposition'] === undefined
        if (isJson && typeof data === 'string' && data.length > 0) {
            return JSON.parse(data)
        }

        return data
    },
})

function extractJwtTokenFromBearer (): JwtPayload | null {
  const token = sessionStorage.getItem('token')
  if (!token) {
    return null;
  }

  try {
    console.log('Jwt token', jwtDecode(token as string))
    return jwtDecode(token as string);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

const RestAPI = (() => {
    let userProfile = {} as UserProfile
    function updateProfile(profile: any) {
        userProfile = {
          ...profile,
          username: extractJwtTokenFromBearer()?.sub
        }
        return profile
    }

    const handle = (response: Promise<AxiosResponse>) => response
        .then(response => response.data)

    const api = {
        profile: () => api.get(`user-account/${extractJwtTokenFromBearer()?.sub}`).then(updateProfile),
        user: (): UserProfile => userProfile,

        get:   <U>(uri: string, settings: AxiosRequestConfig | any = {}): Promise<U>              => handle(axiosInstance.get(uri, settings)),
        patch: <T,U>(uri: string, body: T, settings: AxiosRequestConfig | any = {}): Promise<U>   => handle(axiosInstance.patch(uri, body, settings)),
        post:  <T,U>(uri: string, body: T, settings: AxiosRequestConfig | any = {}): Promise<U>   => handle(axiosInstance.post(uri, body, settings)),
        put:   <T,U>(uri: string, body: T, settings: AxiosRequestConfig | any = {}): Promise<U>   => handle(axiosInstance.put(uri, body, settings)),
        delete: (uri: string, settings: AxiosRequestConfig | any = {}): Promise<void>             => handle(axiosInstance.delete(uri, settings))
    }

    return api
})()

export default RestAPI
