import RestAPI from "./rest-api";

const AccountRepository = (api => {
    return {
        search: ({ types = [], offset = 0, numberOfResults = 0 }) => api.get('accounts', {
            params: {
                type: types,
                offset,
                numberOfResults
            }
        }),
        types: () => api.get('account-types'),
        top: (type, year) => api.get(`accounts/top-by-spending?type=${type}&startDate=${year}-01-01&endDate=${year}-12-31`),
        own: () => api.get('accounts?offset=0&numberOfResults=9999').then((result) => result.content || []),
        get: id => api.get(`accounts/${id}`),
        firstTransaction: (id, description) => api.get(`transactions?offset=0&numberOfResults=1&account=${id}&description=${description}&startDate=1900-01-01&endDate=2999-01-01`)
            .then((result) => result.content[0]),
        transactions: (id, range, page) => api.get(`transactions`, {
            params: {
                offset: (page - 1) * (sessionStorage.getItem('RecordSetPageSize')),
                numberOfResults: sessionStorage.getItem('RecordSetPageSize'),
                account: id,
                startDate: range.startString(),
                endDate: range.endString(),
            }
        }),
        create: account => api.post('accounts', account),
        update: (id, account) => api.put(`accounts/${id}`, account),
        delete: id => api.delete(`accounts/${id}`),
        icon: (id, attachmentId) => api.post(`accounts/${id}/image`, {
            fileCode: attachmentId
        })
    }
})(RestAPI)

export default AccountRepository