import { mdiCloudUploadOutline, mdiPlus } from "@mdi/js";
import React, { FC } from "react";
import { AttachmentRepository } from "../RestAPI";
import { Attachment } from "../../types/types";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { i10n } from "../../config/prime-locale";
import Icon from "@mdi/react";

type UploadAttachmentProps = {
    accepts?: string,
    label: string,
    onUpload: (_: Attachment) => void,
    max?: number,
    required?: boolean
}

const EmptyTemplate: FC<{text: string}> = ({ text }) => {
    return <>
        <div className="flex items-center flex-col text-muted">
            <Icon path={ mdiCloudUploadOutline } size={ 5 } className='bg-[var(--surface-b)] rounded-full p-5'/>
            <span className='text-lg'>{ i10n(text) }</span>
        </div>
    </>
}

const headerTemplate = (props: any) => {
    const { chooseButton, uploadButton } = props;

    return <div className={ `py-2 bg-transparent! gap-2 flex justify-center` }>
        { chooseButton }
        { uploadButton }
    </div>
}

const UploadAttachment = ({ accepts = '*/*', label, onUpload, max = 1 }: UploadAttachmentProps) => {
    const upload = (event: FileUploadHandlerEvent) => {
        Promise.all(event.files.map(file => AttachmentRepository.upload(file)))
            .then(response => response.forEach(onUpload || (_ => console.warn(`No upload handler set, attachmentId=${ response }.`))))
            .then(() => event.options.clear())
    }

    return (
        <FileUpload multiple={ max > 1 }
                    name='upload'
                    mode='advanced'
                    customUpload={ true}
                    uploadHandler={ upload }
                    headerTemplate={ headerTemplate }
                    uploadOptions={ { label: i10n(label), iconOnly: false, icon: () => <Icon path={ mdiCloudUploadOutline } size={ 1 }/>, className: 'p-button-outlined p-button-rounded' } }
                    chooseOptions={ { label: i10n(label), iconOnly: true, icon: () => <Icon path={ mdiPlus } size={ 1 }/>, className: 'p-button-outlined p-button-rounded' } }
                    emptyTemplate={ <EmptyTemplate text={ label } /> }
                    accept={ accepts }/>
    )
}

export default UploadAttachment