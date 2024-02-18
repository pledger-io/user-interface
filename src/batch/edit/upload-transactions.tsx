import { Upload } from "../../core/Attachment";
import { Entity, Form, Input, SubmitButton } from "../../core/form";
import { mdiSkipNext } from "@mdi/js";
import { useState } from "react";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import ProcessRepository from "../../core/repositories/process.repository";
import { Notifications } from "../../core";
import { useNavigate } from "react-router-dom";

const UploadTransactionsComponent = () => {
    const [uploadToken, setUploadToken] = useState<string>('')
    const navigate = useNavigate()

    const onSubmit = (entity: any) => {
        ImportJobRepository.create(entity)
            .then(batchImport => {
                ProcessRepository.start('import_job', {
                    importJobSlug: batchImport.slug,
                    businessKey: batchImport.slug
                })
                    .then(() => navigate(`/upload/${batchImport.slug}/analyze`))
                    .catch(() => Notifications.Service.warning('page.user.profile.import.error'))
            })
            .catch(console.error)
    }

    return <>
        <Form entity='BatchImport' onSubmit={ onSubmit }>
            <Input.Hidden id='uploadToken' required value={ uploadToken }/>

            <Entity.ImportConfig
                id='configuration'
                title='Import.config'
                required />

            <div className='w-[10em] mx-auto mt-5'>
                <Upload
                    label="ImportConfig.content"
                    onUpload={ ({ fileCode }) => setUploadToken(fileCode) }
                    accepts="text/csv" />
            </div>

            <div className='flex justify-end'>
                <SubmitButton icon={ mdiSkipNext }
                              iconPos='after'
                              label='common.action.next' />
            </div>
        </Form>
    </>
}

export default UploadTransactionsComponent