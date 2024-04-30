import React, { useEffect, useState } from "react";
import { AttachmentRepository } from "../RestAPI";

const ImageAttachment = ({ fileCode }: { fileCode: string }) => {
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

export default ImageAttachment