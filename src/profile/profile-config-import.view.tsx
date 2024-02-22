import { Attachments, BreadCrumbItem, BreadCrumbs, Layout, Message, Notifications, Translations } from "../core";
import NavigationComponent from "./navigation.component";
import ProcessRepository, { ProcessStart } from "../core/repositories/process.repository";
import { Form } from "../core/form";
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiCheckDecagram } from "@mdi/js";

type ProfileImportStart = ProcessStart & {
    storageToken: string
}

const ProfileConfigImportView = () => {
    const [importing, setImporting] = useState(false)

    const onUploadComplete = ({ fileCode } : any) => {
        setImporting(true)
        ProcessRepository.start('ImportUserProfile', { storageToken: fileCode } as ProfileImportStart)
            .then(() => Notifications.Service.success('page.user.profile.import.success'))
            .then(() => setImporting(false))
            .catch(() => Notifications.Service.warning('page.user.profile.import.error'))
    }

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile' />
            <BreadCrumbItem label='page.user.profile.import' />
        </BreadCrumbs>

        <Layout.Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent/>
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translations.Translation label='page.user.profile.import'/></h1>

                    <Message type='info' label='page.user.profile.import.explain' />

                    <Form entity='Profile' onSubmit={() => void 0} >
                        <div className='max-w-[10em] mx-auto'>
                            <Attachments.Upload label='page.title.user.profile.import'
                                                accepts='application/json'
                                                onUpload={ onUploadComplete }/>
                        </div>
                    </Form>

                    { importing && <div className='mt-2 flex justify-center'>
                    <span>
                        <Icon path={ mdiCheckDecagram }
                              size={ 1 }
                              className='text-green-500 mr-2'/>
                    </span>
                        <Translations.Translation label='common.upload.file.success'/>
                    </div> }
                </div>
            </div>
        </Layout.Card>
    </>
}

export default ProfileConfigImportView