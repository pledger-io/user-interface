import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import restAPI from "./RestAPI";
import {mdiTrayArrowUp} from "@mdi/js";
import {Buttons, Notifications, When} from "./index";

import UploadSVG from '../assets/ic-upload-file.svg'

/**
 * The attachment service allows for downloading and uploading attachments to the backend.
 */
class AttachmentService {
    upload(blob) {
        const formData = new FormData()
        formData.append('upload', blob, blob.name)
        return restAPI.post('attachment', formData)
    }

    download(fileCode) {
        return new Promise((resolved, failed) => {
            restAPI.get(`attachment/${fileCode}`, {responseType: 'blob'})
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const {result} = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                })
                .catch(failed)
        })
    }
}

function matchingType(accepted, presented) {
    accepted = accepted || '*/*'

    if (accepted === '*/*' || presented === accepted) {
        return true
    }

    return accepted.startsWith('image/') && presented.startsWith('image/');
}

const service = new AttachmentService();
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

const UploadAttachment = ({accepts = '*/*', label, multi = false, onUpload, max = 1}) => {
    const [dropActive, setDropActive] = useState(false)
    const [valid, setValid]           = useState(false)
    const [uniqueId]                  = useState('attachment-' + (++uploadCounter))

    const onFileOver = event => event.preventDefault() || (!dropActive && (setValid(false) || setDropActive(true)))
    const onFileOut  = event => event.preventDefault() || setValid(validDrop(event, max, accepts)) || setDropActive(false)
    const onFileDrop = event => event.preventDefault() || (valid && upload([...event.dataTransfer.items]))

    const upload = files => files.forEach(file => service.upload(file.getAsFile())
        .then(response => (onUpload || (e => console.warn(`No upload handler set, attachmentId=${response}.`)))(response))
        .catch(() => Notifications.Service.warning('common.upload.file.failed')))

    return (
        <div className='UploadAttachment'
             onDrop={onFileDrop}
             onDragLeave={onFileOver}
             onDragOver={onFileOut}>
            <input type='file'
                   id={uniqueId}
                   accept={accepts}
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
    onUpload: PropTypes.func
}


const ImageAttachment = ({fileCode}) => {
    const [data, setData] = useState('')

    useEffect(() => {
        if (fileCode) service.download(fileCode)
            .then(dataImage => setData(dataImage.replace('*/*', 'image/png')))
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
