import RestAPI from "./rest-api";
import { BatchConfig, ImportJob, PagedResponse, Transaction } from "../../types/types";

type ImportJobPage = PagedResponse<ImportJob>
type TransactionPage = PagedResponse<Transaction>

const ImportJobRepository = (api => {
  return {
    create: (importJob: any) => api.post<any, ImportJob>('batch-importer', importJob),
    get: (slug: string) => api.get<ImportJob>(`batch-importer/${ slug }`),
    list: (offset: number, numberOfResults: number) => api.get<ImportJobPage>('batch-importer', {
      params: {
        offset, numberOfResults
      }
    }),
    delete: (slug: string) => api.delete(`batch-importer/${ slug }`),
    transactions: (slug: string, page: number) => api.get<TransactionPage>('transactions', {
      params: {
        offset: (page - 1) * (sessionStorage.getItem('RecordSetPageSize') ? parseInt(sessionStorage.getItem('RecordSetPageSize') as string) : 50),
        numberOfResults: sessionStorage.getItem('RecordSetPageSize') || 50,
        startDate: '1900-01-01',
        endDate: new Date().toISOString().split('T')[0],
        importSlug: slug
      }
    }),

    runTransactionRules: (slug: string) => api.get(`batch-importer/${ slug }/transactions/run-rule-automation`, {}),

    getImportConfigs: (): Promise<BatchConfig[]> => api.get('batch-importer-config'),
    createImportConfig: (config: any) => api.post<any, any>('batch-importer-config', config),
  }
})(RestAPI)

export default ImportJobRepository