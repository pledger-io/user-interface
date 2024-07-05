import RestAPI from "./rest-api";
import { BatchConfig, ImportJob, PagedResponse, Transaction } from "../../types/types";

type PageRequest = {
    page: number
}

type ImportJobPage = PagedResponse<ImportJob>
type TransactionPage = PagedResponse<Transaction>

const ImportJobRepository = (api => {
    return {
        create: (importJob: any)                        => api.put<any, ImportJob>('import', importJob),
        get: (slug: string)                             => api.get<ImportJob>(`import/${slug}`),
        list: (page: number)                            => api.post<PageRequest,ImportJobPage>('import', { page }),
        delete: (slug: string)                          => api.delete(`import/${slug}`),
        transactions: (slug: string, page: number)      => api.post<PageRequest,TransactionPage>(`import/${slug}/transactions`, { page }),

        getImportConfigs: (): Promise<BatchConfig[]>    => api.get('import/config'),
        createImportConfig: (config: any)               => api.put<any, any>('import/config', config),
    }
})(RestAPI)

export default ImportJobRepository