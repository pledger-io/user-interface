import RestAPI from "./rest-api";

export type JobId = 'ImportUserProfile'
export type JobInstance = {
    id: string
    process: string
    businessKey: string
    state: string
    suspended: boolean
}

const ProcessRepository = (api => {

    return {
        start: (jobId: JobId, data: any): Promise<JobInstance>      => api.post(`/runtime-process/${jobId}/start`, data),
    }
})(RestAPI)

export default ProcessRepository