import { mdiCheck, mdiProgressCheck, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { Attributes } from "react";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { ImportJob } from "../../types/types";
import DateComponent from "../format/date.component";
import { Button } from "../layout/button";
import { Confirm } from "../layout/popup";
import Translation from "../localization/translation.component";

const OverviewRowComponent = ({ importJob }: Attributes & { importJob: ImportJob }) => {
    const [deleted, setDeleted] = React.useState(false)

    const onDelete = () => {
        ImportJobRepository.delete(importJob.slug)
            .then(() => setDeleted(true))
            .catch(console.error)
    }

    const hasFinished = importJob.finished
    if (deleted) return null
    return <>
        <tr>
            <td className='align-middle text-center w-5'>
                <Confirm title='common.action.delete'
                         openButton={ <Button variant='icon'
                                              className={ 'text-warning' }
                                              icon={ mdiTrashCanOutline }/> }
                         onConfirm={ onDelete }>
                    <Translation label='page.import.delete.confirm'/>
                </Confirm>
            </td>
            <td className='max-w-32 overflow-x-hidden overflow-ellipsis md:max-w-full'>
                { hasFinished && <Button href={ `/upload/${ importJob.slug }/result` }
                                         variant='text'
                                         message={ importJob.slug }/> }
                { !hasFinished && <Button href={ `/upload/${ importJob.slug }/analyze` }
                                          variant='text'
                                          message={ importJob.slug }/> }
            </td>
            <td className="hidden md:table-cell">{ importJob.config.name }</td>
            <td className='text-center'><DateComponent date={ importJob.created }/></td>
            <td>
                { hasFinished && <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto'/> }
                { !hasFinished && <Icon path={ mdiProgressCheck } size={ 1 } className='text-primary mx-auto'/> }
            </td>
        </tr>
    </>
}

export default OverviewRowComponent