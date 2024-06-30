import { FC, useState } from "react";
import { mdiContentSave, mdiUpload } from "@mdi/js";

import { Upload } from "../../core/attachment";
import { Attachment, Identifier } from "../../core/types";
import { AttachmentRepository } from "../../core/RestAPI";
import ContractRepository from "../../core/repositories/contract-repository";
import { Form, SubmitButton } from "../form";
import { Button } from "../layout/button";
import { Dialog } from "../layout/popup";

import Translation from "../localization/translation.component";
import NotificationService from "../../service/notification.service";

type UploadContractProps = {
    id: Identifier,
    onChanges?: () => void
}

const _: FC<UploadContractProps> = ({ id, onChanges }) => {
    const [attachment, setAttachment] = useState<Attachment | undefined>(undefined)

    const dialogControl = {
        open: () => {
        },
        close: () => {
        }
    }

    const onUpload = (a: Attachment) => {
        if (attachment) {
            AttachmentRepository.delete(attachment.fileCode)
                .then(() => setAttachment(a))
                .catch(() => NotificationService.warning('page.budget.contracts.upload.failed'))
        } else {
            setAttachment(a)
        }
    }
    const onSubmit = () => {
        if (!attachment) {
            dialogControl.close()
        } else {
            ContractRepository.attach(id, attachment)
                .then(() => NotificationService.success('page.budget.contracts.upload.success'))
                .then(() => dialogControl.close())
                .then(() => onChanges && onChanges())
                .catch(() => NotificationService.warning('page.budget.contracts.upload.failed'))
        }
    }

    return <>
        <Button label='page.budget.contracts.action.uploadContract'
                variant='secondary'
                dataTestId='upload-button'
                onClick={ () => dialogControl.open() }
                icon={ mdiUpload }/>

        <Form entity='Contract' onSubmit={ onSubmit }>
            <Dialog control={ dialogControl }
                    actions={ [
                        <SubmitButton key={ 'submit' }
                                      label='common.action.save'
                                      dataTestId='submit-button'
                                      disabled={ !attachment }
                                      icon={ mdiContentSave }/>
                    ] }
                    title='page.budget.contracts.action.uploadContract'>
                <Translation className='border-1 text-gray-400 block mb-3'
                             label='page.budget.contracts.upload.explained'/>

                <div className='max-w-[10em] mx-auto'>
                    <Upload onUpload={ onUpload }
                            accepts={ 'application/pdf' }
                            max={ 1 }
                            label='page.budget.contracts.action.uploadContract'/>
                </div>
            </Dialog>
        </Form>
    </>
}

export default _;