import RestApi from "./rest-api";
import {Contract} from "../types";

const ContractRepository = (api => {
    return {
        list:   ()                                                => api.get('contracts'),
        get:    (id: number): Promise<Contract>                   => api.get(`contracts/${id}`),
        create: (entity: Contract): Promise<Contract>             => api.post('contracts', entity),
        update: (id: number, entity: Contract): Promise<Contract> => api.post(`contracts/${id}`, entity)
    }
})(RestApi)

export default ContractRepository
