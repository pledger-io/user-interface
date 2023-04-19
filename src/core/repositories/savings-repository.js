import RestApi from "./rest-api";

const SavingsRepository = (api => {
    return {
        create: (accountId, savingGoal) => api.post(`accounts/${accountId}/savings`, savingGoal),
        update: (accountId, savingsId, savingGoal) => api.post(`accounts/${accountId}/savings/${savingsId}`, savingGoal),
        assign: (accountId, savingId, amount) => api.put(`accounts/${accountId}/savings/${savingId}/reserve?amount=${amount}`, {}),
        delete: (accountId, savingId) => api.delete(`accounts/${accountId}/savings/${savingId}`)
    }
})(RestApi)

export default SavingsRepository