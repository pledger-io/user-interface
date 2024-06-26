import { FC, useState } from "react";
import { mdiContentSave, mdiUpload } from "@mdi/js";

import { Buttons, Dialog, Notifications, Translations } from "../../core";
import { Upload } from "../../core/attachment";
import { Attachment, Identifier } from "../../core/types";
import { AttachmentRepository } from "../../core/RestAPI";
import ContractRepository from "../../core/repositories/contract-repository";
import { Form, SubmitButton } from "../../core/form";

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
                .catch(() => Notifications.Service.warning('page.budget.contracts.upload.failed'))
        } else {
            setAttachment(a)
        }
    }
    const onSubmit = () => {
        if (!attachment) {
            dialogControl.close()
        } else {
            ContractRepository.attach(id, attachment)
                .then(() => Notifications.Service.success('page.budget.contracts.upload.success'))
                .then(() => dialogControl.close())
                .then(() => onChanges && onChanges())
                .catch(() => Notifications.Service.warning('page.budget.contracts.upload.failed'))
        }
    }

    return <>
        <Buttons.Button label='page.budget.contracts.action.uploadContract'
                        variant='secondary'
                        dataTestId='upload-button'
                        onClick={ () => dialogControl.open() }
                        icon={ mdiUpload }/>

        <Form entity='Contract' onSubmit={ onSubmit }>
            <Dialog.Dialog control={ dialogControl }
                           actions={ [
                               <SubmitButton key={ 'submit' }
                                             label='common.action.save'
                                             dataTestId='submit-button'
                                             disabled={ !attachment }
                                             icon={ mdiContentSave }/>
                           ] }
                           title='page.budget.contracts.action.uploadContract'>
                <Translations.Translation className='border-1 text-gray-400 block mb-3'
                                          label='page.budget.contracts.upload.explained'/>

                <div className='max-w-[10em] mx-auto'>
                    <Upload onUpload={ onUpload }
                            accepts={ 'application/pdf' }
                            max={ 1 }
                            label='page.budget.contracts.action.uploadContract'/>
                </div>
            </Dialog.Dialog>
        </Form>
    </>
}

export default _;