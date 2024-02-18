import ProcessRepository, {
    ProcessTask,
    TaskVariable,
    TaskVariables
} from "../../core/repositories/process.repository";
import React, { useEffect, useState } from "react";
import { Entity, Form, Input, SubmitButton } from "../../core/form";
import { Buttons, Notifications, Translations } from "../../core";
import { InputGroup, useInputField } from "../../core/form/input/InputGroup";
import { mdiDelete, mdiPlusBox, mdiSkipNext } from "@mdi/js";

type ImportConfiguration = TaskVariable & {
    'has-headers': boolean,
    'apply-rules': boolean,
    'generate-accounts': boolean,
    'date-format': string,
    delimiter: string,
    accountId: number,
    'column-roles': string[],
    'custom-indicator': {
        deposit: string,
        credit: string
    }
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

                { field.value.map((mapping: string, index: number) => <div key={ index } className='flex-1 flex items-center gap-1'>
                    <span><Translations.Translation label='ImportConfig.Json.column'/> { index }</span>
                    <select id={ `${ props.id }-${ index }` }
                            onChange={ (event) => onColumnChanges(index, event.currentTarget.value) }
                            value={ mapping }
                            className='flex-1'>
                        <option value="_ignore"><Translations.Translation label="ImportConfig.Json.Mapping.IGNORE"/></option>
                        <option value="transaction-date"><Translations.Translation label="ImportConfig.Json.Mapping.DATE"/></option>
                        <option value="booking-date"><Translations.Translation label="ImportConfig.Json.Mapping.BOOK_DATE"/></option>
                        <option value="interest-date"><Translations.Translation label="ImportConfig.Json.Mapping.INTEREST_DATE"/></option>
                        <option value="opposing-name"><Translations.Translation label="ImportConfig.Json.Mapping.OPPOSING_NAME"/></option>
                        <option value="opposing-iban"><Translations.Translation label="ImportConfig.Json.Mapping.OPPOSING_IBAN"/></option>
                        <option value="account-iban"><Translations.Translation label="ImportConfig.Json.Mapping.ACCOUNT_IBAN"/></option>
                        <option value="amount"><Translations.Translation label="ImportConfig.Json.Mapping.AMOUNT"/></option>
                        <option value="custom-indicator"><Translations.Translation label="ImportConfig.Json.Mapping.CUSTOM_INDICATOR"/></option>
                        <option value="description"><Translations.Translation label="ImportConfig.Json.Mapping.DESCRIPTION"/></option>
                    </select>
                    <Buttons.Button icon={ mdiDelete }
                                    onClick={ () => onDelete(index) }
                                    variant='warning'/>
                </div>) }

                <Buttons.Button label='page.settings.import.details.add'
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
                    ...entity,
                    accountId: entity.accountId.id,
                    'custom-indicator': configuration ? configuration['custom-indicator'] : {},
                    _type: 'com.jongsoft.finance.serialized.ImportConfigJson'
                }
            }
        }

        ProcessRepository.completeTasksVariables('import_job', task.id, updatedConfiguration)
            .then(() => document.location.reload())
            .catch(() => Notifications.Service.warning('page.user.profile.import.error'))
    }

    if (!configuration) return null
    return <>
        <Form entity='' onSubmit={ onSubmit }>
            <Input.Text title='ImportConfig.Json.dateFormat'
                        type='text'
                        id='date-format'
                        value={ configuration["date-format"] }/>

            <Entity.ManagedAccount id='accountId'
                                   required={ true }
                                   title='ImportConfig.Json.account' />

            <Input.Select id='delimiter'
                          title='ImportConfig.Json.delimiter'
                          value={ configuration["delimiter"] }>
                <Input.SelectOption value=',' label='ImportConfig.Json.delimiter.comma'/>
                <Input.SelectOption value=';' label='ImportConfig.Json.delimiter.dotComma'/>
            </Input.Select>

            <ColumnMappingComponent id='column-roles'
                                    title='page.settings.import.analyze.columns'
                                    value={ configuration["column-roles"] } />

            <div className='flex gap-2 items-center'>
                <Input.Toggle id='has-headers'
                              className='ml-[15vw]'
                              value={ configuration["has-headers"] }/>
                <Translations.Translation label='ImportConfig.Json.headers'/>
            </div>
            <div className='flex gap-2 items-center'>
                <Input.Toggle id='generate-accounts'
                              className='ml-[15vw]'
                              value={ configuration["generate-accounts"] }/>
                <Translations.Translation label='ImportConfig.Json.generateAccount'/>
            </div>
            <div className='flex gap-2 items-center'>
                <Input.Toggle id='apply-rules'
                              className='ml-[15vw]'
                              value={ configuration["apply-rules"] }/>
                <Translations.Translation label='ImportConfig.Json.applyRules'/>
            </div>

            <div className='flex justify-end'>
                <SubmitButton label='common.action.next' icon={ mdiSkipNext } iconPos='after'/>
            </div>
        </Form>
    </>
}

export default ConfigureSettingsComponent