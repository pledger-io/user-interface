import { mdiCancel, mdiContentSaveSettings } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { Ref, useImperativeHandle } from "react";
import { i10n } from "../../../config/prime-locale";
import RuleRepository from "../../../core/repositories/rule-repository";
import NotificationService from "../../../service/notification.service";
import { DialogOptions } from "../../../types/types";
import { Form, Input, SubmitButton } from "../../form";
import { Button } from "../../layout/button";

type GroupAddDialogProps = {
  onAdd: () => void,
  ref: Ref<DialogOptions>
}

const GroupAddDialog = (props: GroupAddDialogProps) => {
  const [visible, setVisible] = React.useState(false);

  useImperativeHandle(props.ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onSubmit = (data: any) =>
    RuleRepository.createGroup(data.name)
      .then(props.onAdd)
      .then(() => setVisible(false))
      .catch(() => NotificationService.warning('page.settings.rules.group.add.error'))

  return <>
    <Dialog header={ i10n('page.settings.rules.group.rename') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <Form entity='RuleGroup' onSubmit={ onSubmit }>

        <Input.Text id='name'
                    title='TransactionRule.name'
                    type='text'
                    required/>

        <div className='flex gap-1 justify-end mt-4'>
          <Button label='common.action.cancel'
                  type='reset'
                  severity='secondary'
                  text
                  onClick={() => setVisible(false)}
                  icon={mdiCancel}/>
          <SubmitButton key='save-btn' label='common.action.save' icon={mdiContentSaveSettings}/>
        </div>
      </Form>
    </Dialog>
  </>
}

export default GroupAddDialog
