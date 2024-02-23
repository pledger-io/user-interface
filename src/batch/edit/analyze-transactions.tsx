import { ImportJob } from "../../core/types";
import ProcessRepository, {
    BusinessKey,
    ProcessInstance,
    ProcessTask
} from "../../core/repositories/process.repository";
import { useEffect, useState } from "react";
import { Layout, Notifications, Translations } from "../../core";
import ConfigureSettingsComponent from "./configure-settings.component";
import AccountMappingComponent from "./account-mapping.component";
import { useNavigate } from "react-router-dom";

const AnalyzeTaskComponent = ({ process }: { process: ProcessInstance }) => {
    const [tasks, setTasks] = useState<ProcessTask>()

    function loadTasks() {
        ProcessRepository.tasks('import_job', process.businessKey, process.id)
            .then(tasks => {
                setTasks(tasks[0])
            })
            .catch(() => Notifications.Service.warning('page.user.profile.import.error'))
    }

    useEffect(loadTasks, [process])

    const activeStyle = 'border-b-blue-300 border-b-[1px]'

    return <>
        <div className="flex border-b-[1px] text-muted mb-5">
            <span className={ `py-3 px-5` }>
                <Translations.Translation label='page.nav.settings.import.start'/>
            </span>
            <span className={ `py-3 px-5 ${ tasks?.definition === 'task_configure' ? activeStyle : '' }` }>
                <Translations.Translation label='page.settings.import.analyze.settings'/>
            </span>
            <span className={ `py-3 px-5 ${ tasks?.definition === 'confirm_mappings' ? activeStyle : '' }` }>
                <Translations.Translation label='page.nav.settings.import'/>
            </span>
            <span className={ `py-3 px-5` }>
                <Translations.Translation label='page.settings.import.details'/>
            </span>
        </div>

        { !tasks && <div className='text-center'><Layout.Loading /></div> }

        { tasks?.definition === 'task_configure' && <ConfigureSettingsComponent task={ tasks } /> }
        { tasks?.definition === 'confirm_mappings' && <AccountMappingComponent task={ tasks }/> }
    </>
}


const AnalyzeTransactions = ({ importJob }: { importJob: ImportJob }) => {
    const [process, setProcess] = useState<ProcessInstance>()
    const navigate = useNavigate()

    function loadProcess() {
        ProcessRepository.historyForKey('import_job', importJob.slug as BusinessKey)
            .then(processes => {
                if (processes.length > 0) {
                    const process = processes[0]
                    if (process.state === 'COMPLETED') {
                        Notifications.Service.success('page.user.profile.import.success')
                        navigate(`/upload/${ importJob.slug }/result`)
                    } else setProcess(processes[0])
                }
            })
            .catch(() => Notifications.Service.warning('page.user.profile.import.error'))
    }

    // tslint:disable-next-line:react-hooks/exhaustive-deps
    useEffect(loadProcess, [importJob])

    if (!process) return null
    return <>
        <AnalyzeTaskComponent process={ process }/>
    </>
}

export default AnalyzeTransactions