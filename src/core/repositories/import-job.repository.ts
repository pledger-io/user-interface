import RestAPI from "./rest-api";
import { BatchConfig, ImportJob, Pagination } from "../types";

type ImportJobPage = {
    content: ImportJob[],
    info: Pagination
}

const ImportJobRepository = (api => {
    return {
        create: (importJob: any): Promise<ImportJob>    => api.put('import', importJob),
        get: (slug: string): Promise<ImportJob>         => api.get(`import/${slug}`),
        list: (page: number): Promise<ImportJobPage>    => api.post('import', { page }),
        delete: (slug: string)                          => api.delete(`import/${slug}`),
        transactions: (slug: string, page: number)      => api.post(`import/${slug}/transactions`, { page }),

        getImportConfigs: (): Promise<BatchConfig[]>    => api.get('import/config'),
        createImportConfig: (config: any)       => api.put('import/config', config),
    }
})(RestAPI)

export default ImportJobRepository