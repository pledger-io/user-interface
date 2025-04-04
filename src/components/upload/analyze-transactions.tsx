import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import ProcessRepository, {
  BusinessKey,
  ProcessInstance,
  ProcessTask
} from "../../core/repositories/process.repository";
import NotificationService from "../../service/notification.service";
import { ImportJob } from "../../types/types";
import Loading from "../layout/loading.component";
import AccountMappingComponent from "./account-mapping.component";
import ConfigureSettingsComponent from "./configure-settings.component";
import CreateMissingAccount from "./create-missing-account";

const AnalyzeTaskComponent = ({ process }: { process: ProcessInstance }) => {
  const [tasks, setTasks] = useState<ProcessTask>()

  function loadTasks() {
    ProcessRepository.tasks('import_job', process.businessKey, process.id)
      .then(tasks => {
        setTasks(tasks[0])
      })
      .catch(() => NotificationService.warning('page.user.profile.import.error'))
  }

  useEffect(loadTasks, [process])

  const activeStyle = 'border-b-blue-300 border-b-[1px]'

  return <>
    <div className="flex border-b-[1px] text-muted mb-5">
      <span className={ `py-3 px-5` }>{ i10n('page.nav.settings.import.start') }</span>
      <span className={ `py-3 px-5 ${ tasks?.definition === 'task_configure' ? activeStyle : '' }` }>
        { i10n('page.settings.import.analyze.settings') }
      </span>
      <span className={ `py-3 px-5 ${ tasks?.definition === 'confirm_mappings' ? activeStyle : '' }` }>
        { i10n('page.nav.settings.import') }
      </span>
      <span className={ `py-3 px-5 ${ tasks?.definition === 'user_create_account' ? activeStyle : '' }` }>
        { i10n('page.settings.import.details') }
      </span>
    </div>

    { !tasks && <div className='text-center'><Loading/></div> }

    { tasks?.definition === 'task_configure' && <ConfigureSettingsComponent task={ tasks }/> }
    { tasks?.definition === 'confirm_mappings' && <AccountMappingComponent task={ tasks }/> }
    { tasks?.definition === 'user_create_account' && <CreateMissingAccount task={ tasks }/> }
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
            NotificationService.success('page.user.profile.import.success')
            navigate(`/upload/${ importJob.slug }/result`)
          } else setProcess(processes[0])
        }
      })
      .catch(() => NotificationService.warning('page.user.profile.import.error'))
  }

  useEffect(loadProcess, [importJob])

  if (!process) return null
  return <>
    <AnalyzeTaskComponent process={ process }/>
  </>
}

export default AnalyzeTransactions
