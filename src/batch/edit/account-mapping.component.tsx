import ProcessRepository, {
    ProcessTask,
    TaskVariables
} from "../../core/repositories/process.repository";
import { useEffect, useState } from "react";
import { Paginator } from "../../core/Paginator";
import { Entity, Form, SubmitButton } from "../../core/form";
import { useQueryParam } from "../../core/hooks";
import { mdiSkipNext } from "@mdi/js";
import { Layout, Notifications } from "../../core";
import { Account } from "../../core/types";
import { lookup_entity } from "../../rules/lookup-name.util";

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
            <Entity.Account id={ mapping.name } value={ account }/>
        </div>
    </>
}

const PageOfAccountMappings = ({ accountMappings }: { accountMappings: AccountMapping[] }) => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })

    const first = (parseInt(page) - 1) * 25;
    const last = first + 25;
    return <>

    { accountMappings.map((mapping, index) => (
            <div key={ mapping.name } className={`flex items-center ${index >= first && index <= last ? '' : 'hidden'}`}>
                <AccountMappingRowComponent mapping={ mapping } />
            </div>
        )) }

        <Paginator page={ parseInt(page) }
                   pageSize={ 25 }
                   records={ accountMappings.length } />
    </>
}

const AccountMappingComponent = ({ task }: { task: ProcessTask }) => {
    const [accountMappings, setAccountMappings] = useState<AccountMapping[]>([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        ProcessRepository.taskVariables('import_job', task.id, 'account_mappings')
            .then(variables => {
                const accountMappings = variables.variables.account_mappings.content
                setAccountMappings(accountMappings || [])
            })
    }, []); // eslint-disable-line

    const onSubmit = (entity: any) => {
        const updatedMapping = []
        for (const key in entity) {
            const mapping = entity[key]
            const accountId = mapping && Object.prototype.hasOwnProperty.call(mapping,'id') ? mapping.id : undefined
            updatedMapping.push({
                name: key,
                accountId: accountId,
                _type: 'com.jongsoft.finance.bpmn.delegate.importer.ExtractionMapping'
            })
        }
        const updateVariables: TaskVariables = {
            variables: {
                account_mappings: {
                    _type: 'com.jongsoft.finance.rest.process.VariableMap$VariableList',
                    content: updatedMapping
                }
            }
        }

        setProcessing(true)
        ProcessRepository.completeTasksVariables('import_job', task.id, updateVariables)
            .then(() => document.location.reload())
            .catch(() => Notifications.Service.warning('page.user.profile.import.error'))
    }

    return <>
        { processing && <div className='text-center'><Layout.Loading /></div> }

        { !processing && (
            <Form entity='' onSubmit={ onSubmit }>
                <PageOfAccountMappings accountMappings={ accountMappings } />

                <div className='flex justify-end'>
                    <SubmitButton icon={ mdiSkipNext } label='common.action.next' />
                </div>
            </Form>
            ) }
    </>
}

export default AccountMappingComponent