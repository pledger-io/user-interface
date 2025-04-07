import { mdiCancel, mdiContentSaveSettings } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import React, { FC, Ref, useImperativeHandle, useState } from "react";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import { Upload } from "../../core/attachment";
import ContractRepository from "../../core/repositories/contract-repository";
import { AttachmentRepository } from "../../core/RestAPI";
import { Attachment, DialogOptions, Identifier } from "../../types/types";
import { Form, SubmitButton } from "../form";
import { Button } from "../layout/button";

type UploadContractProps = {
  id: Identifier,
  onChanges?: () => void,
  ref: Ref<DialogOptions>
}

const _: FC<UploadContractProps> = ({ ref, id, onChanges }) => {
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined)
  const [visible, setVisible] = React.useState(false);
  const { success, warning } = useNotification();

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onUpload = (a: Attachment) => {
    if (attachment) {
      AttachmentRepository.delete(attachment.fileCode)
        .then(() => setAttachment(a))
        .catch(() => warning('page.budget.contracts.upload.failed'))
    } else {
      setAttachment(a)
    }
  }
  const onSubmit = () => {
    if (!attachment) {
      setVisible(false)
    } else {
      ContractRepository.attach(id, attachment)
        .then(() => success('page.budget.contracts.upload.success'))
        .then(() => {
          setAttachment(undefined)
          setVisible(false)
        })
        .then(() => onChanges?.())
        .catch(() => warning('page.budget.contracts.upload.failed'))
    }
  }

  return <>
    <Dialog header={ i10n('page.budget.contracts.action.uploadContract') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <Form entity='Contract' onSubmit={ onSubmit }>

        <Message text={ i10n('page.budget.contracts.upload.explained') } severity='info'/>

        <Upload onUpload={ onUpload }
                accepts={ 'application/pdf' }
                max={ 1 }
                required
                label='page.budget.contracts.action.uploadContract'/>

        <div className='flex gap-1 justify-end mt-4'>
          <Button label='common.action.cancel'
                  type='reset'
                  severity='secondary'
                  text
                  onClick={ () => setVisible(false) }
                  icon={ mdiCancel }/>
          <SubmitButton key='save-btn'
                        disabled={ !attachment }
                        label='common.action.save'
                        icon={ mdiContentSaveSettings }/>
        </div>
      </Form>

    </Dialog>
  </>
}

export default _;
