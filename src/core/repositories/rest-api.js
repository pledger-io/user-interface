import axios from "axios";

const config = {
    root: '/api'
}

function generateRequestSettings(settings) {
    const header = {};
    if (sessionStorage.getItem('token')) {
        header['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
    }
    if (localStorage.getItem('language')) {
        header['Accept-Language'] = localStorage.getItem('language');
    }

    return {
        headers: header,
        ...settings
    }
}

const RestAPI = (() => {
    let userProfile = {}
    function updateProfile(profile) {
        userProfile = profile

        document.body.classList.remove('dark', 'navy')
        document.body.classList.add(profile.theme)

        return profile
    }

    const handle = response => new Promise((resolved, error) =>
        response
            .then(httpResponse => resolved(httpResponse.data))
            .catch(({ response }) => {
                if (response.status === 401) {
                    window.dispatchEvent(new Event('credentials-expired'))
                    window.location.reload()
                }
                else error(response?.data?.message || response.statusText)
            }))

    const api = {
        profile: () => api.get('profile').then(updateProfile),
        user: () => userProfile,

        get:   (uri, settings = {})       => handle(axios.get(`${config.root}/${uri}`, generateRequestSettings(settings))),
        patch: (uri, body, settings = {}) => handle(axios.patch(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        post:  (uri, body, settings = {}) => handle(axios.post(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        put:   (uri, body, settings = {}) => handle(axios.put(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        delete: (uri, settings = {})      => handle(axios.delete(`${config.root}/${uri}`, generateRequestSettings(settings)))
    }

    if (sessionStorage.getItem('token')) api.profile().finally(() => {})

    return api
})()

export default RestAPI