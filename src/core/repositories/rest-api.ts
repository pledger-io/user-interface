import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserProfile } from "../../types/types";

const config = {
    root: '/v2/api'
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
    else reject(new Error("Refresh failed"));
  });
  failedQueue = [];
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

const refreshClient = axios.create({
  baseURL: "/v2/api",
  timeout: 1200000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data }= await refreshClient.post('/v2/api/security/oauth', {
        refresh_token: sessionStorage.getItem('refresh-token'),
        grant_type: "refresh_token",
      });

      sessionStorage.setItem('refresh-token', data.refresh_token);
      sessionStorage.setItem('token', data.access_token);

      processQueue(null, data.access_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      sessionStorage.removeItem('token');
      window.location.href = "/ui/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  })

function extractJwtTokenFromBearer (): JwtPayload | null {
  const token = sessionStorage.getItem('token')
  if (!token) {
    return null;
  }

  try {
    const jwtToken = jwtDecode(token as string);
    return (jwtToken as any)?.email || jwtToken.sub
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
        username: extractJwtTokenFromBearer()
      }
      return profile
    }

    const handle = (response: Promise<AxiosResponse>) => response
        .then(response => response.data)

    const api = {
        profile: () => api.get(`user-account/${extractJwtTokenFromBearer()}`).then(updateProfile),
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
