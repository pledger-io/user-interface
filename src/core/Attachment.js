import React from "react";
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

/**
 * The upload attachment component can be used to upload a file to the backend system.
 */
class UploadAttachment extends React.Component {
    static propTypes = {
        // The file type accepted by the upload component
        accepts: PropTypes.string,
        // The translation text key that will be used on the upload button
        label: PropTypes.string,
        // The amount of files that can be uploaded at once, defaults to 1
        multi: PropTypes.number,
        // Callback that will be called after an upload succeeded, once per file uploaded
        onUpload: PropTypes.func
    }

    state = {
        uniqueId: 'attachment-' + (++uploadCounter),
        dropActive: false,
        valid: false,
        selected: []
    }

    render() {
        const {accepts, label, max = 1} = this.props
        const {uniqueId} = this.state

        return (
            <div className='UploadAttachment'
                 onDrop={this.fileDrop.bind(this)}
                 onDragLeave={this.fileOut.bind(this)}
                 onDragOver={this.fileOver.bind(this)}>
                <input type='file'
                       id={uniqueId}
                       accept={accepts || '*.*'}
                       onChange={event => this.selected(event)}/>
                <When condition={max === 1}>
                    <img src={UploadSVG} alt='Attachment'/>

                    <Buttons.Button label={label}
                            icon={mdiTrayArrowUp}
                            onClick={() => this.openFileDialog()}
                            variant='text'/>
                </When>
            </div>
        )
    }

    fileOver(event) {
        event.preventDefault()

        const {dropActive} = this.state
        if (!dropActive) {
            this.setState({
                ...this.state,
                valid: this.isValidDrop(event.dataTransfer.items),
                dropActive: true
            })
        }
    }

    fileOut(event) {
        event.preventDefault()

        this.setState({
            ...this.state,
            valid: false,
            dropActive: false
        })
    }

    fileDrop(event) {
        event.preventDefault();

        const {onUpload} = this.props
        const {valid} = this.state
        if (valid) {
            const selectedFiles = event.dataTransfer.items

            for (let i = 0; i < selectedFiles.length; i++) {
                service.upload(selectedFiles[i].getAsFile())
                    .then(response => (onUpload || (e => console.warn(`No upload handler set, attachmentId=${response}.`)))(response))
                    .catch(() => Notifications.Service.warning('common.upload.file.failed'))
            }
        }
    }

    isValidDrop(dropItems) {
        const {selected} = this.state
        const {max, accepts} = this.props

        if (selected.length + dropItems.length > (max || 1)) {
            Notifications.Service.warning('common.upload.files.tooMany')
            return false;
        }

        for (let x = 0; x < dropItems.length; x++) {
            if (!(dropItems[x].kind === 'file' && matchingType(accepts, dropItems[x].type))) {
                Notifications.Service.warning('common.upload.files.unsupported')
                return false
            }
        }

        return true
    }

    openFileDialog() {
        const {uniqueId} = this.state

        document.getElementById(uniqueId)
            .click();
    }

    selected(event) {

    }
}

class ImageAttachment extends React.Component {
    static propTypes = {
        // The unique code for the attachment to be loaded as an image
        fileCode: PropTypes.string.isRequired
    }

    state = {
        data: null,
        resolved: false
    }

    render() {
        const {fileCode} = this.props;
        const {data, resolved} = this.state;

        if (!data && !resolved && fileCode) {
            service.download(fileCode)
                .then(dataImage => this.setState({
                    data: dataImage.replace('*/*', 'image/png'),
                    resolved: true
                }))
                .catch(() => this.setState({data: null, resolved: true}))
        }

        if (resolved && data) {
            return (
                <img src={this.state.data} className='ImageAttachment' alt='Attachment'/>
            )
        }
        return <div className='ImageAttachment not-found'/>
    }
}

export {
    ImageAttachment as Image,
    UploadAttachment as Upload
}
