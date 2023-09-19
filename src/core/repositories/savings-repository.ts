import RestApi from "./rest-api";
import {SavingGoal} from "../types";

const SavingsRepository = (api => {
    return {
        create: (accountId: number, savingGoal: SavingGoal) => api.post(`accounts/${accountId}/savings`, savingGoal),
        update: (accountId: number, savingsId: number, savingGoal: SavingGoal) => api.post(`accounts/${accountId}/savings/${savingsId}`, savingGoal),
        assign: (accountId: number, savingId: number , amount: number) => api.put(`accounts/${accountId}/savings/${savingId}/reserve?amount=${amount}`, {}),
        delete: (accountId: number, savingId: number) => api.delete(`accounts/${accountId}/savings/${savingId}`)
    }
})(RestApi)

export default SavingsRepository