import RestApi from "./rest-api";
import { Attachment, Contract, Identifier, PagedResponse, Transaction } from "../../types/types";

export type ContractList = Contract[]
type TransactionPage = PagedResponse<Transaction>

const ContractRepository = (api => {
  return {
    list: (status: 'INACTIVE' | 'ACTIVE') => api.get<ContractList>(`contracts?status=${ status }`),
    get: (id: Identifier) => api.get<Contract>(`contracts/${ id }`),
    create: (entity: Contract) => api.post<Contract, Contract>('contracts', entity),
    update: (id: Identifier, entity: Contract) => api.put<Contract, Contract>(`contracts/${ id }`, entity),
    delete: (id: Identifier) => api.delete(`contracts/${ id }`),
    schedule: (entity: any) => api.post<any, Contract>(`schedules`, entity),
    warn: (id: Identifier): Promise<Contract> => api.post(`contracts/${ id }/warn-before-expiration`,null),
    attach: (id: Identifier, file: Attachment) => api.post<any, void>(`contracts/${ id }/attachment`, file),
    transactions: (id: Identifier, page: number) => api.get<TransactionPage>(`transactions?offset=${ page * 25 }&numberOfResults=25&contract=${id}&startDate=1900-01-01&endDate=2900-01-01`)
  }
})(RestApi)

export default ContractRepository
