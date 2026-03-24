import { Dropdown } from "primereact/dropdown";
import React from "react";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { Identifier, ImportJobTask } from "../../types/types";
import { Entity, Form, Input, SubmitButton } from "../form";
import { useInputField } from "../form/input/InputGroup";
import { Button } from "../layout/button";

type ImportConfiguration = ImportJobTask & {
  variables?: {
    importerConfiguration: {
      'has-headers': boolean,
      'apply-rules': boolean,
      'date-format': string,
      delimiter: string,
      'column-roles': string[],
      'custom-indicator': {
        deposit: string,
        credit: string
      }
    },
    applyRules: boolean,
    generateAccounts: boolean,
    accountId?: Identifier
  }
}

const ColumnMappingComponent = (props: any) => {
  const [field, _, onChange] = useInputField({ onChange: (_) => void 0, field: props })

  const onAddColumn = () => {
    onChange({
      persist: () => {
      }, currentTarget: { value: [...field.value, ''] }
    })
  }
  const onDelete = (index: number) => {
    const updatedValue = field.value.filter((_: any, i: number) => i !== index)
    onChange({
      persist: () => {
      }, currentTarget: { value: updatedValue }
    })
  }

  const onColumnChanges = (index: number, value: string) => {
    const updatedValue = field.value
    updatedValue[index] = value
    onChange({
      persist: () => {
      }, currentTarget: { value: updatedValue }
    })
  }

  if (!field) return <></>
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <label htmlFor={ props.id } className='font-bold'>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>
      <div className='flex flex-col gap-2'>
        {/* eslint-disable-next-line @eslint-react/no-array-index-key */ }
        { field.value.map((mapping: string, index: number) => <div key={ index } className='flex-1 flex items-center gap-1'>
          <span className='min-w-32'>{ i10n('ImportConfig.Json.column' )}{ index }</span>
          <Dropdown id={ `${ props.id }-${ index }` }
                    className='flex-1'
                    options={ [
                      { label: i10n('ImportConfig.Json.Mapping.IGNORE'), value: '_ignore' },
                      { label: i10n('ImportConfig.Json.Mapping.DATE'), value: 'transaction-date' },
                      { label: i10n('ImportConfig.Json.Mapping.BOOK_DATE'), value: 'booking-date' },
                      { label: i10n('ImportConfig.Json.Mapping.INTEREST_DATE'), value: 'interest-date' },
                      { label: i10n('ImportConfig.Json.Mapping.OPPOSING_NAME'), value: 'opposing-name' },
                      { label: i10n('ImportConfig.Json.Mapping.OPPOSING_IBAN'), value: 'opposing-iban' },
                      { label: i10n('ImportConfig.Json.Mapping.ACCOUNT_IBAN'), value: 'account-iban' },
                      { label: i10n('ImportConfig.Json.Mapping.AMOUNT'), value: 'amount' },
                      { label: i10n('ImportConfig.Json.Mapping.CUSTOM_INDICATOR'), value: 'custom-indicator' },
                      { label: i10n('ImportConfig.Json.Mapping.DESCRIPTION'), value: 'description' }
                    ] }
                    onChange={ (event) => onColumnChanges(index, event.value) }
                    value={ mapping }/>
          <Button icon={ 'mdi:delete' }
                  text
                  onClick={ () => onDelete(index) }
                  severity='danger'/>
        </div>)}
      </div>
      <div className='flex gap-2 justify-center'>
        <Button label='page.settings.import.details.add'
                severity='secondary'
                onClick={ onAddColumn }
                icon={ 'mdi:plus-box' }/>
      </div>
    </div>
  </>
}

const ConfigureSettingsComponent = ({ slug, task }: { slug: string, task: ImportJobTask }) => {
  const { warning } = useNotification()

  const importConfigurationTask = task as ImportConfiguration
  const onSubmit = (entity: any) => {
    const updatedConfiguration: ImportConfiguration = {
      ...importConfigurationTask,
      variables: {
        ...importConfigurationTask.variables,
        applyRules: entity.applyRules,
        generateAccounts: entity.generateAccounts,
        accountId: entity.account.id,
        importerConfiguration: {
          ...importConfigurationTask.variables.importerConfiguration,
          'has-headers': entity['has-headers'],
          'date-format': entity['date-format'],
          delimiter: entity.delimiter,
          'column-roles': entity['column-roles']
        }
      }
    }

    ImportJobRepository.completeTask(slug, updatedConfiguration)
      .then(() => {
        setTimeout(() => {
          document.location.reload()
        }, 2000)
      })
      .catch(() => warning('page.user.profile.import.error'))
  }

  const configuration = importConfigurationTask.variables
  return <>
    <Form entity='' onSubmit={ onSubmit }>
      <Input.Text title='ImportConfig.Json.dateFormat'
                  type='text'
                  id='date-format'
                  value={ configuration.importerConfiguration["date-format"] }/>

      <Entity.ManagedAccount id='account'
                             required={ true }
                             title='ImportConfig.Json.account'/>

      <Input.Select id='delimiter'
                    title='ImportConfig.Json.delimiter'
                    options={ [
                      { label: 'ImportConfig.Json.delimiter.comma', value: ',' },
                      { label: 'ImportConfig.Json.delimiter.dotComma', value: ';' }
                    ] }
                    value={ configuration.importerConfiguration["delimiter"] } />

      <ColumnMappingComponent id='column-roles'
                              title='page.settings.import.analyze.columns'
                              value={ configuration.importerConfiguration["column-roles"] }/>

      <div className='flex gap-2 items-center'>
        <Input.Toggle id='has-headers'
                      className='ml-[15vw]'
                      value={ configuration.importerConfiguration["has-headers"] }/>
        { i10n('ImportConfig.Json.headers') }
      </div>
      <div className='flex gap-2 items-center'>
        <Input.Toggle id='generateAccounts'
                      className='ml-[15vw]'
                      value={ configuration.generateAccounts }/>
        { i10n('ImportConfig.Json.generateAccount') }
      </div>
      <div className='flex gap-2 items-center'>
        <Input.Toggle id='applyRules'
                      className='ml-[15vw]'
                      value={ configuration.applyRules }/>
        { i10n('ImportConfig.Json.applyRules') }
      </div>

      <div className='flex justify-end'>
        <SubmitButton label='common.action.next' icon={ 'mdi:skip-next' } iconPos='right' />
      </div>
    </Form>
  </>
}

export default ConfigureSettingsComponent
