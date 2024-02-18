import RestApi from "./rest-api";
import { Attachment, Contract, Identifier, PagedResponse, Transaction } from "../types";

export type ContractList = {
    active: Contract[],
    terminated: Contract[]
}
type TransactionPage = PagedResponse<Transaction>

const ContractRepository = (api => {
    return {
        list:   ()                                  => api.get<ContractList>('contracts'),
        get:    (id: Identifier)                    => api.get<Contract>(`contracts/${id}`),
        create: (entity: Contract)                  => api.post<Contract, Contract>('contracts', entity),
        update: (id: Identifier, entity: Contract)  => api.post<Contract, Contract>(`contracts/${id}`, entity),
        delete: (id: Identifier)                    => api.delete(`contracts/${id}`),
        schedule: (id: Identifier, entity: any)     => api.post<any, Contract>(`contracts/${id}/schedule`, entity),
        warn: (id: Identifier): Promise<Contract>   => api.get(`contracts/${id}/expire-warning`),
        attach: (id: Identifier, file: Attachment)  => api.post<any, void>(`contracts/${id}/attachment`, file),
        transactions: (id: Identifier, page: number)=> api.get<TransactionPage>(`contracts/${id}/transactions?page=${page}`)
    }
})(RestApi)

export default ContractRepository
