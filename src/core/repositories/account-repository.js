import RestAPI from "./rest-api";

const AccountRepository = (api => {
    return {
        search: ({ types = [], page = 1 }) => api.post('accounts', {
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

export default AccountRepository