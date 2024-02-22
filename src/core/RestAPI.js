import RestApi from "./repositories/rest-api";


const SettingRepository = (api => {
    return {
        list: () => api.get('settings'),
        update: (id, value) => api.post(`settings/${id}`, { value })
    }
})(RestApi)

const AttachmentRepository = (api => {
    return {
        upload: blob => {
            const formData = new FormData()
            formData.append('upload', blob, blob.name)
            return api.post('attachment', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        },
        download: fileCode => new Promise((resolved, reject) => {
            api.get(`attachment/${fileCode}`, { responseType: 'blob' })
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const { result } = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                }).catch(reject)
        }),
        delete: fileCode => api.delete(`attachment/${fileCode}`)
    }
})(RestApi)

const TransactionRepository = (api => {
    return {
        create: (id, transaction) => api.put(`accounts/${id}/transactions`, transaction),
        get: (id, transactionId) => api.get(`accounts/${id}/transactions/${transactionId}`),
        update: (transactionId, transaction) => api.post(`accounts/-1/transactions/${transactionId}`, transaction),
        splits: (transactionId, split) => api.patch(`accounts/-1/transactions/${transactionId}`, split),
        search: searchCommand => api.post('transactions', searchCommand),
        delete: (id, transactionId) => api.delete(`accounts/${id}/transactions/${transactionId}`),
    }
})(RestApi)

const CurrencyRepository = (api => {
    return {
        list: () => api.get('settings/currencies'),
        get: code => api.get(`settings/currencies/${code}`),
        change: (code, enabled) => api.patch(`settings/currencies/${code}`, { enabled: enabled })
    }
})(RestApi)

const TransactionScheduleRepository = (api => {
    return {
        list: () => api.get('schedule/transaction'),
        create: schedule => api.put('schedule/transaction', schedule),
        get: id => api.get(`schedule/transaction/${id}`),
        delete: ({ id }) => api.delete(`schedule/transaction/${id}`),
        update: (id, schedule) => api.patch(`schedule/transaction/${id}`, schedule)
    }
})(RestApi)

const LocalizationRepository = (api => {
    return {
        get: language => api.get(`localization/lang/${language}/`)
    }
})(RestApi)

export {
    AttachmentRepository,
    TransactionRepository,
    TransactionScheduleRepository,
    CurrencyRepository,
    SettingRepository,
    LocalizationRepository
}
