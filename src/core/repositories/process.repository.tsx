import RestAPI from "./rest-api";

export type ProcessIdentifier = 'ImportUserProfile' | 'AccountReconcile'
export type ProcessState = 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'
export type BusinessKey = string
export type ProcessInstance = {
    id: string
    process: string                         // The id of the process definition.
    businessKey: BusinessKey                // The business key of the process instance
    state: ProcessState                     // The state of the process instance.
    suspended: boolean
    dates?: {
        start: string                       // The date/time when this process instance was started.
        end: string                         // The date/time when this process instance was ended.
    }
}
export type ProcessVariable = {
    id: string
    name: string
    value: any
}
export type ProcessTask = {
    id: string
    name: string
    created: string
    form: string
    definition: string
}
export type ProcessStart = {
    businessKey?: BusinessKey            // The business key of the process instance
}

const ProcessRepository = (api => {
    function start<T extends ProcessStart>(definitionId: ProcessIdentifier, data: T): Promise<ProcessInstance> {
        return api.put(`/runtime-process/${definitionId}/start`, data)
    }

    return {
        history: (definitionId: ProcessIdentifier): Promise<ProcessInstance[]> =>
            api.get(`runtime-process/${definitionId}`),
        historyForKey: (definitionId: ProcessIdentifier, businessKey: BusinessKey): Promise<ProcessInstance[]> =>
            api.get(`runtime-process/${definitionId}/${businessKey}`),
        delete: (definitionId: ProcessIdentifier, businessKey: BusinessKey, instanceId: string): Promise<void> =>
            api.delete(`runtime-process/${definitionId}/${businessKey}/${instanceId}`),
        variables: (definitionId: ProcessIdentifier, businessKey: BusinessKey, instanceId: string): Promise<ProcessVariable[]> =>
            api.get(`runtime-process/${definitionId}/${businessKey}/${instanceId}/variables`),
        tasks: (definitionId: ProcessIdentifier, businessKey: BusinessKey, instanceId: string): Promise<ProcessTask[]> =>
            api.get(`runtime-process/${definitionId}/${businessKey}/${instanceId}/tasks`),
        completeTask: (definitionId: ProcessIdentifier, businessKey: BusinessKey, instanceId: string, taskId: string): Promise<void> =>
            api.delete(`runtime-process/${definitionId}/${businessKey}/${instanceId}/tasks/${taskId}`),
        start: start,
    }
})(RestAPI)

export default ProcessRepository