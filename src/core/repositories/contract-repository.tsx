import RestApi from "./rest-api";
import { Attachment, Contract, Identifier } from "../types";

const ContractRepository = (api => {
    return {
        list:   ()                                                    => api.get('contracts'),
        get:    (id: Identifier): Promise<Contract>                   => api.get(`contracts/${id}`),
        create: (entity: Contract): Promise<Contract>                 => api.post('contracts', entity),
        update: (id: Identifier, entity: Contract): Promise<Contract> => api.post(`contracts/${id}`, entity),
        delete: (id: Identifier): Promise<void>                       => api.delete(`contracts/${id}`),
        schedule: (id: Identifier, entity: any): Promise<Contract>    => api.post(`contracts/${id}/schedule`, entity),
        warn: (id: Identifier): Promise<Contract>                     => api.get(`contracts/${id}/expire-warning`),
        attach: (id: Identifier, file: Attachment): Promise<void>     => api.post(`contracts/${id}/attachment`, file),
        transactions: (id: Identifier, page: number): Promise<any>    => api.get(`contracts/${id}/transactions?page=${page}`)
    }
})(RestApi)

export default ContractRepository
