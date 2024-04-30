import { Upload } from "../../core/attachment";
import { Entity, Form, Input, SubmitButton } from "../../core/form";
import { mdiCheckDecagram, mdiSkipNext } from "@mdi/js";
import { useState } from "react";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import ProcessRepository from "../../core/repositories/process.repository";
import { Notifications, Translations } from "../../core";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";

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

            <div className={ `w-[10em] mx-auto mt-5` }>
                <Upload
                    required
                    label="ImportConfig.content"
                    onUpload={ ({ fileCode }) => setUploadToken(fileCode) }
                    accepts="text/csv" />
            </div>

            { uploadToken && <div className='mt-2 flex justify-center'>
                    <span>
                        <Icon path={ mdiCheckDecagram }
                              size={ 1 }
                              className='text-green-500 mr-2'/>
                    </span>
                <Translations.Translation label='common.upload.file.success'/>
            </div> }

            <div className='flex justify-end'>
                <SubmitButton icon={ mdiSkipNext }
                              iconPos='after'
                              label='common.action.next' />
            </div>
        </Form>
    </>
}

export default UploadTransactionsComponent