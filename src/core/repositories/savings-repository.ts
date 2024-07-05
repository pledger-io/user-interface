import RestApi from "./rest-api";
import { Account, Identifier, SavingGoal } from "../../types/types";

const SavingsRepository = (api => {
    return {
        create: (accountId: Identifier, savingGoal: SavingGoal): Promise<Account>                         => api.post(`accounts/${accountId}/savings`, savingGoal),
        update: (accountId: Identifier, savingsId: Identifier, savingGoal: SavingGoal): Promise<Account>  => api.post(`accounts/${accountId}/savings/${savingsId}`, savingGoal),
        assign: (accountId: Identifier, savingId: Identifier , amount: number): Promise<Account>          => api.put(`accounts/${accountId}/savings/${savingId}/reserve?amount=${amount}`, {}),
        delete: (accountId: Identifier, savingId: Identifier)                                             => api.delete(`accounts/${accountId}/savings/${savingId}`)
    }
})(RestApi)

export default SavingsRepository