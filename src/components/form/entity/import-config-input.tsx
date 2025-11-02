import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Upload } from "../../../core/attachment";
import ImportJobRepository from "../../../core/repositories/import-job.repository";
import { BatchConfig, DialogOptions } from "../../../types/types";
import { FieldType } from "../form-types";
import { useInputField } from "../input/InputGroup";
import { i10n } from "../../../config/prime-locale";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "../../layout/button";
import { mdiCancel, mdiContentSave, mdiPlus } from "@mdi/js";
import { Form } from "../Form";
import { SelectInput } from "../input/SelectInput";
import { TextInput } from "../input/TextInput";
import { SubmitButton } from "../input/SubmitButton";
import { Message } from "primereact/message";

type ImportConfigInputProps = FieldType & {
  title?: string,
  help?: string,
  readonly?: boolean,
  className?: string,
  onChange?: (_: string) => void
}
const ImportConfigInput = (props: Readonly<ImportConfigInputProps>) => {
  const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
  const [importConfig, setImportConfig] = useState<BatchConfig[]>()
  const dialogRef = useRef<DialogOptions>(null)

  const loadConfigs = () => {
    ImportJobRepository.getImportConfigs()
      .then(setImportConfig)
      .catch(console.error)
  }
  useEffect(loadConfigs, [])

  const handleChangeEvent = (e: DropdownChangeEvent) => {
    onChange({
      currentTarget: {
        value: e.value
      }
    })
  }

  if (!field) return <></>
  return <>
    <div className={ `flex flex-col gap-2 mt-2 ${ props.className || '' }` }>
      <UploadConfigDialog callback={ loadConfigs } ref={ dialogRef }/>
      <label htmlFor={ props.id }
             className='font-bold'>{ i10n(props.title as string) }{ props.required ? ' *' : '' }</label>

      <div className='flex'>
        <Dropdown id={ props.id }
                  name={ props.id }
                  value={ field.value || props.value }
                  options={ importConfig }
                  onChange={ handleChangeEvent }
                  required={ props.required }
                  className='flex-1'
                  optionValue='name'
                  optionLabel='name'
                  invalid={ field.touched ? errors.length > 0 : undefined }/>
        <Button icon={ mdiPlus }
                severity='info'
                onClick={ () => dialogRef.current?.open() }
                className='!rounded-none'/>
      </div>
    </div>
  </>
}

const UploadConfigDialog = ({ ref, callback }: { ref: Ref<DialogOptions>, callback: () => void }) => {
  const [visible, setVisible] = useState(false)
  const [uploadToken, setUploadToken] = useState<string>()

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onCreate = ({ name, type }: any) => {
    ImportJobRepository.createImportConfig({
      type: type || 'CSVImportProvider',
      fileCode: uploadToken,
      name: name || 'Unknown config'
    })
      .then(callback)
      .then(() => setVisible(false))
  }

  return <>
    <Dialog header={ i10n('page.settings.import.config.new') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <Form entity='Config' onSubmit={ onCreate }>
        <Message text={ i10n('page.settings.import.config.explain') } severity='info' />

        <SelectInput id='type'
                     title='ImportConfig.type'
                     required
                     options={ [
                       { value: 'CSVImportProvider', message: 'CSV' },
                     ] }/>

        <TextInput id='name'
                   title='ImportConfig.name'
                   required
                   type='text'/>

        { !uploadToken && <Upload onUpload={ event => setUploadToken(event.fileCode) }
                label="ImportConfig.content"
                accepts="application/json"/> }

        <div className='flex gap-1 justify-end mt-4'>
          <Button label='common.action.cancel'
                  text
                  severity='secondary'
                  type='reset'
                  onClick={ () => setVisible(false) }
                  icon={ mdiCancel }/>
          <SubmitButton label='common.action.save'
                        icon={ mdiContentSave }
                        disabled={ !uploadToken }
                        data-testid={ `import-config-submit-button` }/>
        </div>
      </Form>
    </Dialog>
  </>
}

export default ImportConfigInput
