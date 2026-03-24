import { Icon } from "@iconify-icon/react";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Message } from "primereact/message";
import React, { FC, useState } from "react";
import { Form } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import ProfileRepository from "../../core/repositories/profile.repository";

const headerTemplate = (props: any) => {
  const { chooseButton, uploadButton } = props;

  return <div className={ `py-2 bg-transparent! gap-2 flex justify-center` }>
    { chooseButton }
    { uploadButton }
  </div>
}

const EmptyTemplate: FC<{text: string}> = ({ text }) => {
  return <>
    <div className="flex items-center flex-col text-muted">
      <Icon icon={ 'mdi:cloud-upload-outline' } width='10em' className='bg-(--surface-b) rounded-full p-5'/>
      <span className='text-lg'>{ i10n(text) }</span>
    </div>
  </>
}

const ProfileConfigImportView = () => {
  const [importing, setImporting] = useState(false)
  const { success, warning } = useNotification()

  const onUpload = (event: FileUploadHandlerEvent) => {
    setImporting(true)
    event.files[0].text().then(text => {
      const importData = JSON.parse(text)
      ProfileRepository.importProfile(importData)
        .then(() => success('page.user.profile.import.success'))
        .then(() => setImporting(false))
        .catch(() => warning('page.user.profile.import.error'))
    })
  }

  return <>
    <h1 className='font-bold text-lg'>{ i10n('page.user.profile.import') }</h1>

    <Message severity='info' text={ i10n('page.user.profile.import.explain') } />

    <Form entity='Profile' onSubmit={ () => void 0 }>
      <div className='max-w-[25em] mx-auto py-4'>
        <FileUpload multiple={ false }
                    name='upload'
                    mode='advanced'
                    customUpload={ true}
                    uploadHandler={ onUpload }
                    headerTemplate={ headerTemplate }
                    uploadOptions={ { label: i10n('page.title.user.profile.import'), iconOnly: false, icon: () => <Icon icon={ 'mdi:cloud-upload-outline' }/>, className: 'p-button-outlined p-button-rounded' } }
                    chooseOptions={ { label: i10n('page.title.user.profile.import'), iconOnly: true, icon: () => <Icon icon={ 'mdi:plus' }/>, className: 'p-button-outlined p-button-rounded' } }
                    emptyTemplate={ <EmptyTemplate text={ 'page.title.user.profile.import' } /> }
                    accept='application/json'/>
      </div>
    </Form>

    { importing &&
      <div className='mt-2 flex justify-center'>
        <span>
            <Icon icon={ 'mdi:check-decagram' }
                  className='text-green-500 mr-2'/>
        </span>
        { i10n('common.upload.file.success') }
    </div> }
  </>
}

export default ProfileConfigImportView
