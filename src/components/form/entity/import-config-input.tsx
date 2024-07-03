import React, { useEffect, useState } from "react";


import Dialog from "../../../components/layout/popup/dialog.component";
import Message from "../../layout/message.component";
import { Upload } from "../../../core/attachment";
import ImportJobRepository from "../../../core/repositories/import-job.repository";
import { BatchConfig } from "../../../core/types";
import { Button } from "../../layout/button";
import { PopupCallbacks } from "../../layout/popup/popup.component";
import { FieldType } from "../form-types";
import { InputGroup, useInputField } from "../input/InputGroup";

type ImportConfigInputProps = FieldType & {
    title?: string,
    help?: string,
    readonly?: boolean,
    className?: string,
    onChange?: (_: string) => void
}
const ImportConfigInput = (props: Readonly<ImportConfigInputProps>) => {
    const [importConfigs, setImportConfigs] = useState<BatchConfig[]>([])
    const [field, errors, onChange] = useInputField({ onChange: props.onChange, field: props })
    const inputRef = React.useRef<HTMLInputElement>(null)
    const typeRef = React.useRef<HTMLSelectElement>(null)
    const dialogControl: PopupCallbacks = { open: () => {}, close: () => {} }

    useEffect(() => {
        ImportJobRepository.getImportConfigs()
            .then(setImportConfigs)
            .catch(console.error)
    }, [])

    const onCreate = ({ fileCode } : any) => {
        ImportJobRepository.createImportConfig({
            type: typeRef.current?.value || 'CSVImportProvider',
            fileCode: fileCode,
            name: inputRef.current?.value || 'Unknown config'
        })
            .then(config => setImportConfigs([...importConfigs, config]))
            .then(() => dialogControl.close())
    }

    if (!field) return null
    return <InputGroup id={ props.id }
                       required={ props.required }
                       title={ props.title }
                       help={ props.help }
                       className={ props.className }
                       valid={ field.touched ? errors.length === 0 : undefined }>

        <div className='flex gap-1'>
            <select id={ props.id } onChange={ onChange } className='flex-1'>
                <option disabled={ field.value }>-</option>
                {
                    importConfigs.map(config =>
                        <option key={ config.file } value={ config.name }>{ config.name }</option>)
                }
            </select>

            <Dialog title='page.settings.import.config.new'
                    control={ dialogControl }
                    openButton={ <Button label='page.settings.import.config.new'/> }>
                <Message label='page.settings.import.config.explain'/>

                <select id='type' ref={ typeRef } className='w-full mt-5'>
                    <option value='CSVImportProvider'>CSV</option>
                </select>

                <input type='text' className='w-full mt-5' placeholder='Name' ref={ inputRef }/>

                <div className='w-[10em] mx-auto mt-5'>
                    <Upload
                        onUpload={ onCreate }
                        label="ImportConfig.content"
                        accepts="application/json"/>
                </div>
            </Dialog>
        </div>
    </InputGroup>
}

export default ImportConfigInput