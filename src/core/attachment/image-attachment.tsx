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
        return <img src={data} className='max-w-4 md:max-w-8' alt='Attachment'/>
    }

    return <div className='ImageAttachment not-found'/>
}

export default ImageAttachment