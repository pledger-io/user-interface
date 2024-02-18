import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { AttachmentRepository } from "./RestAPI";
import { mdiTrayArrowUp } from "@mdi/js";
import { Buttons, Notifications, When } from "./index";

import UploadSVG from '../assets/ic-upload-file.svg'

function matchingType(accepted, presented) {
    accepted = accepted || '*/*'

    if (accepted === '*/*' || presented === accepted) {
        return true
    }

    return accepted.startsWith('image/') && presented.startsWith('image/');
}

let uploadCounter = 0

const validDrop = (event, max, accepts) => {
    if (event.dataTransfer.items.length > (max || 1)) {
        Notifications.Service.warning('common.upload.files.tooMany')
        return false;
    }

    const invalidFiles = [...event.dataTransfer.items]
        .filter(item => item.kind !== 'file' || !matchingType(accepts, item.type))
        .length > 0

    if (invalidFiles) {
        Notifications.Service.warning('common.upload.files.unsupported')
        return false;
    }

    return true
}

const UploadAttachment = ({ accepts = '*/*', label, onUpload, max = 1, required = false }) => {
    const [dropActive, setDropActive] = useState(false)
    const [valid, setValid]           = useState(false)
    const [uniqueId]                  = useState('attachment-' + (++uploadCounter))

    const onFileOver = event => event.preventDefault() || (!dropActive && (setValid(false) || setDropActive(true)))
    const onFileOut  = event => event.preventDefault() || setValid(validDrop(event, max, accepts)) || setDropActive(false)
    const onFileDrop = event => event.preventDefault() || (valid && upload([...event.dataTransfer.items]))

    const upload = files => files.forEach(file => AttachmentRepository.upload(file.getAsFile())
        .then(response => (onUpload || (_ => console.warn(`No upload handler set, attachmentId=${response}.`)))(response))
        .catch(() => Notifications.Service.warning('common.upload.file.failed')))

    return (
        <div className='UploadAttachment'
             onDrop={onFileDrop}
             onDragLeave={onFileOver}
             onDragOver={onFileOut}>
            <input type='file'
                   id={uniqueId}
                   accept={accepts}
                   required={ required }
                   onChange={event => this.selected(event)}/>
            <When condition={max === 1}>
                <img src={UploadSVG} alt='Attachment'/>

                <Buttons.Button label={label}
                                icon={mdiTrayArrowUp}
                                onClick={() => document.getElementById(uniqueId).click()}
                                variant='text'/>
            </When>
        </div>
    )
}
UploadAttachment.propTypes = {
    // The file type accepted by the upload component
    accepts: PropTypes.string,
    // The translation text key that will be used on the upload button
    label: PropTypes.string,
    // The amount of files that can be uploaded at once, defaults to 1
    multi: PropTypes.number,
    // the maximum number of files to support
    max: PropTypes.number,
    // Callback that will be called after an upload succeeded, once per file uploaded
    onUpload: PropTypes.func,
    // Whether the upload is required or not
    required: PropTypes.bool
}


const ImageAttachment = ({ fileCode }) => {
    const [data, setData] = useState('')

    useEffect(() => {
        if (fileCode) {
            AttachmentRepository.download(fileCode)
                .then(dataImage => setData(dataImage.replace('*/*', 'image/png')))
                .catch(() => undefined)
        }
    }, [fileCode])

    if (data !== '') {
        return <img src={data} className='ImageAttachment' alt='Attachment'/>
    }

    return <div className='ImageAttachment not-found'/>
}
ImageAttachment.propTypes = {
    // The unique code for the attachment to be loaded as an image
    fileCode: PropTypes.string
}


export {
    ImageAttachment as Image,
    UploadAttachment as Upload
}
