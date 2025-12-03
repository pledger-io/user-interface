import RestApi from "./repositories/rest-api";


const SettingRepository = (api => {
    return {
        list: () => api.get('settings'),
        update: (id, value) => api.patch(`settings/${id}`, { value })
    }
})(RestApi)

const AttachmentRepository = (api => {
    return {
        upload: blob => {
            const formData = new FormData()
            formData.append('upload', blob, blob.name)
            return api.post('files', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        },
        download: fileCode => new Promise((resolved, reject) => {
            api.get(`files/${fileCode}`, { responseType: 'blob' })
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const { result } = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                }).catch(reject)
        }),
        delete: fileCode => api.delete(`files/${fileCode}`)
    }
})(RestApi)

const TransactionRepository = (api => {
    return {
        create: (id, transaction) => api.post(`transactions`, transaction),
        get: (id, transactionId) => api.get(`transactions/${transactionId}`),
        update: (transactionId, transaction) => api.put(`transactions/${transactionId}`, transaction),
        splits: (transactionId, split) => api.patch(`transactions/${transactionId}`, split),
        search: searchCommand => api.get('transactions', {params: searchCommand}),
        suggest: suggestCommand => api.get('ai/auto-complete', { params: suggestCommand }),
        extract: extractCommand => api.post('ai/extract', extractCommand),
        delete: (id, transactionId) => api.delete(`transactions/${transactionId}`),
    }
})(RestApi)

const CurrencyRepository = (api => {
    let knownCurrencies = []
    return {
        list: () => api.get('currencies').then(currencies => {
            knownCurrencies = currencies
            return currencies
        }),
        get: code => api.get(`currencies/${code}`),
        change: (code, enabled) => api.patch(`currencies/${code}`, { enabled: enabled })
            .then(response => {
                const currency = knownCurrencies.find(currency => currency.code === code)
                currency.enabled = enabled
                return response
            }),
        create: (model) => api.post(`currencies`, model),
        update: (code, model) => api.put(`currencies/${code}`, model),
        cached: (code) => knownCurrencies.find(currency => currency.code === code)
    }
})(RestApi)

const TransactionScheduleRepository = (api => {
    return {
        list: () => api.get('schedules'),
        create: schedule => api.post('schedules', schedule),
        get: id => api.get(`schedules/${id}`),
        delete: ({ id }) => api.delete(`schedules/${id}`),
        update: (id, schedule) => api.patch(`schedules/${id}`, schedule)
    }
})(RestApi)

export {
    AttachmentRepository,
    TransactionRepository,
    TransactionScheduleRepository,
    CurrencyRepository,
    SettingRepository
}
