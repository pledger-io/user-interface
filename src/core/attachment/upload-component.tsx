import { Buttons, When } from "../index";
import React, { DragEventHandler, useState } from "react";
import { AttachmentRepository } from "../RestAPI";
import { mdiTrayArrowUp } from "@mdi/js";

import UploadSVG from "../../assets/ic-upload-file.svg";
import { Attachment } from "../types";
import NotificationService from "../../service/notification.service";

function matchingType(accepted: string, presented: string) {
    accepted = accepted || '*/*'

    if (accepted === '*/*' || presented === accepted) {
        return true
    }

    return accepted.startsWith('image/') && presented.startsWith('image/');
}

let uploadCounter = 0

const validDrop = (event: React.DragEvent, max: number | null, accepts: string) => {
    if (event.dataTransfer.items.length > (max || 1)) {
        NotificationService.warning('common.upload.files.tooMany')
        return false;
    }

    const invalidFiles = [...event.dataTransfer.items]
        .filter(item => item.kind !== 'file' || !matchingType(accepts, item.type))
        .length > 0

    if (invalidFiles) {
        NotificationService.warning('common.upload.files.unsupported')
        return false;
    }

    return true
}

type UploadAttachmentProps = {
    accepts?: string,
    label: string,
    onUpload: (_: Attachment) => void,
    max?: number,
    required?: boolean
}

const UploadAttachment = ({ accepts = '*/*', label, onUpload, max = 1, required = false } : UploadAttachmentProps) => {
    const [dropActive, setDropActive] = useState(false)
    const [valid, setValid]           = useState(false)
    const [uniqueId]                  = useState('attachment-' + (++uploadCounter))

    const onFileOver: DragEventHandler = event => {
        event.preventDefault()
        if (!dropActive) {
            setValid(false)
            setDropActive(true)
        }
    }
    const onFileOut: DragEventHandler = event => {
        event.preventDefault()
        setValid(validDrop(event, max, accepts))
        setDropActive(false)
    }
    const onFileDrop: DragEventHandler = event => {
        event.preventDefault()
        if (valid && event.dataTransfer) {
            upload([...event.dataTransfer.items])
        }
    }

    const upload = (files: DataTransferItem[]) => files.forEach(file => AttachmentRepository.upload(file.getAsFile())
        .then(response => (onUpload || (_ => console.warn(`No upload handler set, attachmentId=${response}.`)))(response))
        .catch(() => NotificationService.warning('common.upload.file.failed')))

    const onChangeHandler = (files: FileList | null) => {
        if (!files) {
            return
        }

        for (let i = 0; i < files.length; i++) {
            AttachmentRepository.upload(files[i])
                .then(response => (onUpload || (_ => console.warn(`No upload handler set, attachmentId=${response}.`)))(response))
                .catch(() => NotificationService.warning('common.upload.file.failed'))
        }
    }

    return (
        <div className='UploadAttachment'
             onDrop={ onFileDrop }
             onDragLeave={ onFileOver }
             onDragOver={ onFileOut }>
            <input type='file'
                   id={uniqueId}
                   accept={accepts}
                   required={ required }
                   onChange={event => onChangeHandler(event.target.files) }/>
            <When condition={max === 1}>
                <img src={UploadSVG} alt='Attachment'/>

                <Buttons.Button label={label}
                                icon={mdiTrayArrowUp}
                                onClick={ () => document.getElementById(uniqueId)?.click() }
                                variant='text'/>
            </When>
        </div>
    )
}

export default UploadAttachment