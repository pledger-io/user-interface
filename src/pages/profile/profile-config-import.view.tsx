import { mdiCheckDecagram } from "@mdi/js";
import Icon from "@mdi/react";
import { Message } from "primereact/message";
import { useState } from "react";
import { Form } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import { Attachment } from "../../core";
import ProcessRepository, { ProcessStart } from "../../core/repositories/process.repository";

type ProfileImportStart = ProcessStart & {
  storageToken: string
}

const ProfileConfigImportView = () => {
  const [importing, setImporting] = useState(false)
  const { success, warning } = useNotification()

  const onUploadComplete = ({ fileCode }: any) => {
    setImporting(true)
    ProcessRepository.start('ImportUserProfile', { storageToken: fileCode } as ProfileImportStart)
      .then(() => success('page.user.profile.import.success'))
      .then(() => setImporting(false))
      .catch(() => warning('page.user.profile.import.error'))
  }

  return <>
    <h1 className='font-bold text-lg'>{ i10n('page.user.profile.import') }</h1>

    <Message severity='info' text={ i10n('page.user.profile.import.explain') } />

    <Form entity='Profile' onSubmit={ () => void 0 }>
      <div className='max-w-[25em] mx-auto py-4'>
        <Attachment.Upload label='page.title.user.profile.import'
                           accepts='application/json'
                           onUpload={ onUploadComplete }/>
      </div>
    </Form>

    { importing &&
      <div className='mt-2 flex justify-center'>
        <span>
            <Icon path={ mdiCheckDecagram }
                  size={ 1 }
                  className='text-green-500 mr-2'/>
        </span>
        { i10n('common.upload.file.success') }
    </div> }
  </>
}

export default ProfileConfigImportView
