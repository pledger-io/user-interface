import {FC} from "react";
import {mdiDownload} from "@mdi/js";
import {Buttons} from "../index";
import {AttachmentRepository} from "../RestAPI";

type DownloadButtonProps = {
    title: string,
    fileName?: string,
    fileCode?: string
}

const DownloadButton: FC<DownloadButtonProps> = ({ title, fileCode, fileName }) => {

    const onDownload = () => AttachmentRepository.download(fileCode)
            .then(data => {
                const ab = atob(data.split(',')[1])
                const buffer = new ArrayBuffer(ab.length)
                const ia = new Uint8Array(buffer);
                for (let i = 0; i < ab.length; i++) {
                    ia[i] = ab.charCodeAt(i);
                }

                // convert data-uri blog to a Blob
                const blob = new Blob([buffer], {type: 'application/octet-stream'})
                const dataUri = window.URL.createObjectURL(blob)

                const hiddenClicker = document.createElement('a')
                hiddenClicker.href = dataUri
                hiddenClicker.download = fileName || 'unknown.dat'
                hiddenClicker.dispatchEvent(new MouseEvent('click'))
            })
            .catch(console.log)

    return <>
        <Buttons.Button label={ title }
                        onClick={ onDownload }
                        variant='secondary'
                        icon={ mdiDownload }/>
    </>
}

export default DownloadButton