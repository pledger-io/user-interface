import axios from 'axios';

const config = {
    root: '/api'
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
                    window.location.reload()
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
        types: () => api.get('account-types'),
        top: (type, year) => api.get(`accounts/top/${type}/${year}-01-01/${year}-12-31`),
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
        update: (id, account) => api.post(`accounts/${id}`, account),
        delete: id => api.delete(`accounts/${id}`),
        icon: (id, attachmentId) => api.post(`accounts/${id}/image`, {
            fileCode: attachmentId
        })
    }
})(RestAPI)

const SavingsRepository = (api => {
    return {
        create: (accountId, savingGoal) => api.post(`accounts/${accountId}/savings`, savingGoal),
        update: (accountId, savingsId, savingGoal) => api.post(`accounts/${accountId}/savings/${savingsId}`, savingGoal),
        assign: (accountId, savingId, amount) => api.put(`accounts/${accountId}/savings/${savingId}/reserve?amount=${amount}`, {}),
        delete: (accountId, savingId) => api.delete(`accounts/${accountId}/savings/${savingId}`)
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

const SettingRepository = (api => {
    return {
        list: () => api.get('settings'),
        update: (id, value) => api.post(`settings/${id}`, {value})
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

const CategoryRepository = (api => {
    return {
        all: () => api.get('categories'),
        list: page => api.post('categories', {page: page}),
        get: id => api.get(`categories/${id}`),
        update: (id, category) => api.post(`categories/${id}`, category),
        create: category => api.put('categories', category),
        delete: ({id}) => api.delete(`categories/${id}`)
    }
})(RestAPI)

const TransactionRepository = (api => {
    return {
        search: searchCommand => api.post('transactions', searchCommand)
    }
})(RestAPI)

const CurrencyRepository = (api => {
    return {
        list: () => api.get('settings/currencies'),
        get: code => api.get(`settings/currencies/${code}`)
    }
})(RestAPI)

const TransactionScheduleRepository = (api => {
    return {
        list: () => api.get('schedule/transaction'),
        create: schedule => api.put('schedule/transaction', schedule),
        get: id => api.get(`schedule/transaction/${id}`),
        delete: ({id}) => api.delete(`schedule/transaction/${id}`),
        update: (id, schedule) => api.patch(`schedule/transaction/${id}`, schedule)
    }
})(RestAPI)

const BudgetRepository = (api => {
    return {
        forMonth: (year, month) => api.get(`budgets/${year}/${month}`)
    }
})(RestAPI)

export default RestAPI;
export {
    AccountRepository,
    SecurityRepository,
    AttachmentRepository,
    CategoryRepository,
    TransactionRepository,
    TransactionScheduleRepository,
    CurrencyRepository,
    SavingsRepository,
    SettingRepository,
    BudgetRepository
}
