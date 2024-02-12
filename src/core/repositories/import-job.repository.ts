import RestAPI from "./rest-api";
import { ImportJob, Pagination } from "../types";

type ImportJobPage = {
    content: ImportJob[],
    info: Pagination
}

const ImportJobRepository = (api => {
    return {
        get: (slug: string): Promise<ImportJob>         => api.get(`import/${slug}`),
        list: (page: number): Promise<ImportJobPage>    => api.post('import', { page }),
        delete: (slug: string)                          => api.delete(`import/${slug}`),
        transactions: (slug: string, page: number)      => api.post(`import/${slug}/transactions`, { page })
    }
})(RestAPI)

export default ImportJobRepository