import { Upload } from "../../core/attachment";
import NotificationService from "../../service/notification.service";
import { Entity, Form, Input, SubmitButton } from "../form";
import { mdiCheckDecagram, mdiSkipNext } from "@mdi/js";
import { useState } from "react";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import ProcessRepository from "../../core/repositories/process.repository";
import { useNavigate } from "react-router";
import Icon from "@mdi/react";
import Translation from "../localization/translation.component";

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
                    .catch(() => NotificationService.warning('page.user.profile.import.error'))
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
                <Translation label='common.upload.file.success'/>
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