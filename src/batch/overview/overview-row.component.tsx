import { ImportJob } from "../../core/types";
import { Buttons, Dialog, Formats, Translations } from "../../core";
import Icon from "@mdi/react";
import { mdiCheck, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import ImportJobRepository from "../../core/repositories/import-job.repository";

const OverviewRowComponent = ({ importJob }: { importJob: ImportJob }) => {
    const [deleted, setDeleted] = React.useState(false)

    const onDelete = () => {
        ImportJobRepository.delete(importJob.slug)
            .then(() => setDeleted(true))
            .catch(console.error)
    }

    const hasFinished = importJob.finished !== null
    if (deleted) return null
    return <>
        <tr>
            <td className='align-middle text-center w-5'>
                <Dialog.ConfirmPopup title='common.action.delete'
                                     openButton={ <Buttons.Button variant='icon'
                                                                  className={ 'text-warning' }
                                                                  icon={ mdiTrashCanOutline }/> }
                                     onConfirm={ onDelete }>
                    <Translations.Translation label='page.import.delete.confirm'/>
                </Dialog.ConfirmPopup>
            </td>
            <td>
                { hasFinished && <Buttons.Button href={ `/upload/${ importJob.slug }/result` }
                                                 variant='text'
                                                 message={ importJob.slug }/> }
                { !hasFinished && <Buttons.Button href={ `/upload/${ importJob.slug }/analyze` }
                                                 variant='text'
                                                 message={ importJob.slug }/> }
            </td>
            <td className="hidden md:table-cell">{ importJob.config.name }</td>
            <td className='text-center'><Formats.Date date={ importJob.created }/></td>
            <td>
                { hasFinished && <Icon path={ mdiCheck} size={ 1 } className='text-success mx-auto'/> }
            </td>
        </tr>
    </>
}

export default OverviewRowComponent