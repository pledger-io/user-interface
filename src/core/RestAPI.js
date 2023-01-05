import axios from 'axios';

const config = {
    root: 'http://dev.ota.pledger.io/api'
    //root: 'http://localhost:8080/api'
}

class TokenResponse {
    constructor(props) {
        this.username = props.username;
        this.accessToken = props['access_token'];
        this.refreshToken = props['refresh_token'];
    }
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

    const handle = response => new Promise((resolved, error) =>
        response
            .then(httpResponse => resolved(httpResponse.data))
            .catch(({response}) => {
                if (response.status === 401) {
                    SecurityRepository.logout()
                    document.body.href.reload()
                }
                else error(response?.data?.message || response.statusText)
            }))

    const api = {
        profile: () => api.get('profile'),
        user: () => userProfile,

        get:   (uri, settings = {})       => handle(axios.get(`${config.root}/${uri}`, generateRequestSettings(settings))),
        patch: (uri, body, settings = {}) => handle(axios.patch(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        post:  (uri, body, settings = {}) => handle(axios.post(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        put:   (uri, body, settings = {}) => handle(axios.put(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        delete: (uri, settings = {})      => handle(axios.delete(`${config.root}/${uri}`, generateRequestSettings(settings)))
    }

    if (sessionStorage.getItem('token')) api.profile().then(profile => userProfile = profile)

    return api
})()

const AccountRepository = (api => {
    return {
        search: ({types = [], page = 1}) => api.post('accounts', {
            accountTypes: types,
            page: page
        }),
        own: () => api.get('accounts/my-own'),
        get: id => api.get(`accounts/${id}`),
        firstTransaction: (id, description) => api.get(`accounts/${id}/transactions/first?description=${description}`),
        transactions: (id, range, page) => api.post(`accounts/${id}/transactions`, {
            page: page,
            dateRange: {
                start: range.startString(),
                end: range.endString()
            }
        }),
        create: account => api.put('accounts', account),
        update: (id, account) => api.post(`account/${id}`, account),
        delete: id => api.delete(`accounts/${id}`),
        icon: (id, attachmentId) => api.post(`accounts/${id}/image`, {
            fileCode: attachmentId
        })
    }
})(RestAPI)

const SecurityRepository = (api => {
    return {
        authenticate: (username, password) => api.post('security/authenticate', {username: username, password: password})
            .then(serverResponse => {
                const token = new TokenResponse(serverResponse)
                sessionStorage.setItem('refresh-token', token.refreshToken);
                sessionStorage.setItem('token', token.accessToken);
            }),
        register: (username, password) => api.put(`security/create-account`, {username, password}),
        logout: () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh-token');
        }
    }
})(RestAPI)

const AttachmentRepository = (api => {
    return {
        upload: blob => {
            const formData = new FormData()
            formData.append('upload', blob, blob.name)
            return api.post('attachment', formData)
        },
        download: fileCode => new Promise((resolved, reject) => {
            api.get(`attachment/${fileCode}`, {responseType: 'blob'})
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const {result} = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                }).catch(reject)
        })
    }
})(RestAPI)

export default RestAPI;
export {
    AccountRepository,
    SecurityRepository,
    AttachmentRepository
}
