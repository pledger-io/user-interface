import ProcessRepository, {
    ProcessTask,
    TaskVariable,
    TaskVariables
} from "../../core/repositories/process.repository";
import React, { useEffect, useState } from "react";
import NotificationService from "../../service/notification.service";
import { Entity, Form, Input, SubmitButton } from "../form";
import { InputGroup, useInputField } from "../form/input/InputGroup";
import { mdiDelete, mdiPlusBox, mdiSkipNext } from "@mdi/js";
import { Identifier } from "../../types/types";
import { Button } from "../layout/button";
import Translation from "../localization/translation.component";

type ImportConfiguration = TaskVariable & {
    importConfiguration: {
        'has-headers': boolean,
        'apply-rules': boolean,
        'date-format': string,
        delimiter: string,
        'column-roles': string[],
        'custom-indicator': {
            deposit: string,
            credit: string
        },
        type: 'com.jongsoft.finance.importer.csv.CSVConfiguration'
    },
    applyRules: boolean,
    generateAccounts: boolean,
    accountId?: Identifier,
    _type: 'com.jongsoft.finance.serialized.ImportJobSettings'
}

const ColumnMappingComponent = (props: any) => {
    const [field, errors, onChange] = useInputField({ onChange: (_) => void 0, field: props })

    const onAddColumn = () => {
        onChange({ persist: () => {}, currentTarget: { value: [...field.value, ''] } })
    }
    const onDelete = (index: number) => {
        const updatedValue = field.value.filter((_: any, i: number) => i !== index)
        onChange({ persist: () => {}, currentTarget: { value: updatedValue } })
    }

    const onColumnChanges = (index: number, value: string) => {
        const updatedValue = field.value
        updatedValue[index] = value
        onChange({ persist: () => {}, currentTarget: { value: updatedValue } })
    }

    if (!field) return <></>
    return <>
        <InputGroup id={ props.id }
                    required={ props.required }
                    title={ props.title }
                    help={ props.help }
                    className={ props.className }
                    valid={ field.touched ? errors.length === 0 : undefined }>
            <div className='flex flex-col gap-2'>

              {/* eslint-disable-next-line @eslint-react/no-array-index-key */}
                { field.value.map((mapping: string, index: number) => <div key={ index } className='flex-1 flex items-center gap-1'>
                    <span><Translation label='ImportConfig.Json.column'/> { index }</span>
                    <select id={ `${ props.id }-${ index }` }
                            onChange={ (event) => onColumnChanges(index, event.currentTarget.value) }
                            value={ mapping }
                            className='flex-1'>
                        <option value="_ignore"><Translation label="ImportConfig.Json.Mapping.IGNORE"/></option>
                        <option value="transaction-date"><Translation label="ImportConfig.Json.Mapping.DATE"/></option>
                        <option value="booking-date"><Translation label="ImportConfig.Json.Mapping.BOOK_DATE"/></option>
                        <option value="interest-date"><Translation label="ImportConfig.Json.Mapping.INTEREST_DATE"/></option>
                        <option value="opposing-name"><Translation label="ImportConfig.Json.Mapping.OPPOSING_NAME"/></option>
                        <option value="opposing-iban"><Translation label="ImportConfig.Json.Mapping.OPPOSING_IBAN"/></option>
                        <option value="account-iban"><Translation label="ImportConfig.Json.Mapping.ACCOUNT_IBAN"/></option>
                        <option value="amount"><Translation label="ImportConfig.Json.Mapping.AMOUNT"/></option>
                        <option value="custom-indicator"><Translation label="ImportConfig.Json.Mapping.CUSTOM_INDICATOR"/></option>
                        <option value="description"><Translation label="ImportConfig.Json.Mapping.DESCRIPTION"/></option>
                    </select>
                    <Button icon={ mdiDelete }
                                    onClick={ () => onDelete(index) }
                                    variant='warning'/>
                </div>) }

                <Button label='page.settings.import.details.add'
                                variant='secondary'
                                onClick={ onAddColumn }
                                icon={ mdiPlusBox }/>
            </div>
        </InputGroup>
    </>
}

const ConfigureSettingsComponent = ({ task }: { task: ProcessTask }) => {
    const [configuration, setConfiguration] = useState<ImportConfiguration>()

    useEffect(() => {
        ProcessRepository.taskVariables('import_job', task.id, 'initialConfig')
            .then(variables => {
                setConfiguration(variables.variables.initialConfig as ImportConfiguration)
            })
    }, [task]);

    const onSubmit = (entity: any) => {
        const updatedConfiguration: TaskVariables = {
            variables: {
                updatedConfig: {
                    _type: 'com.jongsoft.finance.serialized.ImportJobSettings',
                    applyRules: entity.applyRules,
                    generateAccounts: entity.generateAccounts,
                    accountId: entity.account.id,
                    importConfiguration: {
                        'has-headers': entity['has-headers'],
                        'date-format': entity['date-format'],
                        delimiter: entity.delimiter,
                        'column-roles': entity['column-roles'],
                        'custom-indicator': configuration ? configuration.importConfiguration['custom-indicator'] : {},
                        type: 'com.jongsoft.finance.importer.csv.CSVConfiguration'
                    }
                } as ImportConfiguration
            }
        }

        ProcessRepository.completeTasksVariables('import_job', task.id, updatedConfiguration)
            .then(() => document.location.reload())
            .catch(() => NotificationService.warning('page.user.profile.import.error'))
    }

    if (!configuration) return null
    return <>
        <Form entity='' onSubmit={ onSubmit }>
            <Input.Text title='ImportConfig.Json.dateFormat'
                        type='text'
                        id='date-format'
                        value={ configuration.importConfiguration["date-format"] }/>

            <Entity.ManagedAccount id='account'
                                   required={ true }
                                   title='ImportConfig.Json.account' />

            <Input.Select id='delimiter'
                          title='ImportConfig.Json.delimiter'
                          value={ configuration.importConfiguration["delimiter"] }>
                <Input.SelectOption value=',' label='ImportConfig.Json.delimiter.comma'/>
                <Input.SelectOption value=';' label='ImportConfig.Json.delimiter.dotComma'/>
            </Input.Select>

            <ColumnMappingComponent id='column-roles'
                                    title='page.settings.import.analyze.columns'
                                    value={ configuration.importConfiguration["column-roles"] } />

            <div className='flex gap-2 items-center'>
                <Input.Toggle id='has-headers'
                              className='ml-[15vw]'
                              value={ configuration.importConfiguration["has-headers"] }/>
                <Translation label='ImportConfig.Json.headers'/>
            </div>
            <div className='flex gap-2 items-center'>
                <Input.Toggle id='generateAccounts'
                              className='ml-[15vw]'
                              value={ configuration.generateAccounts }/>
                <Translation label='ImportConfig.Json.generateAccount'/>
            </div>
            <div className='flex gap-2 items-center'>
                <Input.Toggle id='applyRules'
                              className='ml-[15vw]'
                              value={ configuration.applyRules }/>
                <Translation label='ImportConfig.Json.applyRules'/>
            </div>

            <div className='flex justify-end'>
                <SubmitButton label='common.action.next' icon={ mdiSkipNext } iconPos='after'/>
            </div>
        </Form>
    </>
}

export default ConfigureSettingsComponent
