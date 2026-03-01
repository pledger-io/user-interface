import { useNotification } from "../../context/notification-context";
import { Upload } from "../../core/attachment";
import { Entity, Form, Input, SubmitButton } from "../form";
import { mdiCheckDecagram, mdiSkipNext } from "@mdi/js";
import { useState } from "react";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { useNavigate } from "react-router";
import Icon from "@mdi/react";
import { i10n } from "../../config/prime-locale";

const UploadTransactionsComponent = () => {
  const [uploadToken, setUploadToken] = useState<string>('')
  const navigate = useNavigate()
  const { warning } = useNotification()

  const onSubmit = (entity: any) => {
    ImportJobRepository.create(entity)
      .then(response => navigate(`/upload/${ response.slug }/analyze`))
      .catch(() => warning('page.user.profile.import.error'))
  }

  return <>
    <Form entity='BatchImport' onSubmit={ onSubmit }>
      <Input.Hidden id='fileToken' required value={ uploadToken }/>

      <Entity.ImportConfig id='configuration' title='Import.config' required/>

      { !uploadToken && <div className={ `w-[25em] mx-auto mt-5` }>
        <Upload
          required
          label="ImportConfig.content"
          onUpload={ ({ fileCode }) => setUploadToken(fileCode) }
          accepts="text/csv"/>
      </div> }

      { uploadToken &&
        <div className='mt-2 flex justify-center'>
          <span>
            <Icon path={ mdiCheckDecagram } size={ 1 } className='text-green-500 mr-2'/>
          </span>
          { i10n('common.upload.file.success') }
        </div>
      }

      <div className='flex justify-end'>
        <SubmitButton icon={ mdiSkipNext }
                      label='common.action.next'/>
      </div>
    </Form>
  </>
}

export default UploadTransactionsComponent
