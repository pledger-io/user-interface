import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { ImportJob, ImportJobTask } from "../../types/types";
import Loading from "../layout/loading.component";
import ConfigureSettingsComponent from "./configure-settings.component";
import CreateMissingAccount from "./create-missing-account";

const AnalyzeTaskComponent = ({ slug, tasks }: { slug: string, tasks: ImportJobTask[] }) => {
  const activeStyle = 'border-b-blue-300 border-b-[1px]'

  const firstTask = tasks[0];
  return <>
    <div className="flex border-b text-muted mb-5">
      <span className={ `py-3 px-5` }>{ i10n('page.nav.settings.import.start') }</span>
      <span className={ `py-3 px-5 ${ firstTask?.name === 'configuration' ? activeStyle : '' }` }>
        { i10n('page.settings.import.analyze.settings') }
      </span>
      <span className={ `py-3 px-5 ${ firstTask?.name === 'account-mapping' ? activeStyle : '' }` }>
        { i10n('page.settings.import.details') }
      </span>
    </div>

    { !tasks && <div className='text-center'><Loading/></div> }

    { firstTask?.name === 'configuration' && <ConfigureSettingsComponent task={ firstTask } slug={ slug } /> }
    { firstTask?.name === 'account-mapping' && <CreateMissingAccount task={ firstTask } slug={ slug } /> }
  </>
}


const AnalyzeTransactions = ({ importJob }: { importJob: ImportJob }) => {
  const [tasks, setTasks] = useState<ImportJobTask[]>()
  const { warning } = useNotification()

  function loadTasks() {
    ImportJobRepository.tasks(importJob.slug)
      .then(setTasks)
      .catch((e: AxiosError) => {
        if (e.status === 400 && (e.response?.data as any)?.message == 'Batch is not waiting for user tasks.') {
          setTasks([])
          setTimeout(loadTasks, 500)
        } else {
          warning('page.user.profile.import.error')
        }
      })
  }

  useEffect(loadTasks, [importJob])

  if (!tasks) return <Loading />
  return <>
    <AnalyzeTaskComponent tasks={ tasks } slug={ importJob.slug }/>
  </>
}

export default AnalyzeTransactions
