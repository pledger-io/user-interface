import { mdiSkipNext } from "@mdi/js";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "../../context/notification-context";
import ProcessRepository, { ProcessTask, TaskVariables } from "../../core/repositories/process.repository";
import useQueryParam from "../../hooks/query-param.hook";
import { Account } from "../../types/types";
import { Entity, Form, SubmitButton } from "../form";
import Loading from "../layout/loading.component";
import { lookup_entity } from "../lookup-name.util";

type AccountMapping = {
  name: string;
  accountId?: number
}

const AccountMappingRowComponent = ({ mapping }: { mapping: AccountMapping }) => {
  const [account, setAccount] = useState<Account>()

  useEffect(() => {
    if (mapping.accountId)
      lookup_entity<Account>('TO_ACCOUNT', mapping.accountId)
        .then(setAccount)
  }, [mapping.accountId])

  return <>
    <div className='w-[25em] font-bold'>{ mapping.name }</div>
    <div className='flex-1'>
      <Entity.Account id={ mapping.name } value={ account } inputOnly={ true }/>
    </div>
  </>
}

const PageOfAccountMappings = ({ accountMappings }: { accountMappings: AccountMapping[] }) => {
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const navigate = useNavigate()

  const first = (parseInt(page) - 1) * 25;
  const last = first + 25;
  return <>

    { accountMappings.map((mapping, index) => (
      <div key={ mapping.name } className={ `flex items-center ${ index >= first && index <= last ? '' : 'hidden' }` }>
        <AccountMappingRowComponent mapping={ mapping }/>
      </div>
    )) }

    <Paginator totalRecords={ accountMappings.length }
               rows={ 25 }
               onPageChange={ event => navigate(`?page=${ event.page + 1 }`) }/>
  </>
}

const AccountMappingComponent = ({ task }: { task: ProcessTask }) => {
  const [accountMappings, setAccountMappings] = useState<AccountMapping[]>([]);
  const [processing, setProcessing] = useState(false);
  const { warning } = useNotification()

  useEffect(() => {
    ProcessRepository.taskVariables('import_job', task.id, 'account_mappings')
      .then(variables => {
        const accountMappings = variables.variables.account_mappings.content
        setAccountMappings(accountMappings || [])
      })
  }, []);

  const onSubmit = (entity: any) => {
    const updatedMapping = []
    for (const key in entity) {
      const mapping = entity[key]
      const accountId = mapping && Object.prototype.hasOwnProperty.call(mapping, 'id') ? mapping.id : undefined
      updatedMapping.push({
        name: key,
        accountId: accountId,
        _type: 'com.jongsoft.finance.bpmn.delegate.importer.ExtractionMapping'
      })
    }
    const updateVariables: TaskVariables = {
      variables: {
        account_mappings: {
          _type: 'com.jongsoft.finance.rest.model.runtime.ListVariable',
          content: updatedMapping
        }
      }
    }

    setProcessing(true)
    ProcessRepository.completeTasksVariables('import_job', task.id, updateVariables)
      .then(() => document.location.reload())
      .catch(() => warning('page.user.profile.import.error'))
  }

  return <>
    { processing && <div className='text-center'><Loading/></div> }

    { !processing && (
      <Form entity='' onSubmit={ onSubmit }>
        <PageOfAccountMappings accountMappings={ accountMappings }/>

        <div className='flex justify-end'>
          <SubmitButton icon={ mdiSkipNext } label='common.action.next'/>
        </div>
      </Form>
    ) }
  </>
}

export default AccountMappingComponent
