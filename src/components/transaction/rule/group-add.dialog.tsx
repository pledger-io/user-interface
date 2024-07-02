import { mdiContentSave, mdiPlus } from "@mdi/js";
import React from "react";
import RuleRepository from "../../../core/repositories/rule-repository";
import NotificationService from "../../../service/notification.service";
import { Form, Input, SubmitButton } from "../../form";
import { Button } from "../../layout/button";
import { Dialog } from "../../layout/popup";
import { PopupCallbacks } from "../../layout/popup/popup.component";

type GroupAddDialogProps = {
    onAdd: () => void
}

const GroupAddDialog = (props: GroupAddDialogProps) => {
    const dialogControl: PopupCallbacks = {
        close: () => {
        }, open: () => {
        }
    }
    const onSubmit = (data: any) =>
        RuleRepository.createGroup(data.name)
            .then(props.onAdd)
            .then(() => dialogControl.close())
            .catch(() => NotificationService.warning('page.settings.rules.group.add.error'))

    return <>
        <Form entity='RuleGroup' onSubmit={ onSubmit }>
            <Dialog title='page.settings.rules.group.rename'
                    className='Large'
                    control={ dialogControl }
                    actions={ [
                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave }
                                      variant='primary'/>,
                    ] }
                    openButton={
                        <Button label='page.settings.rules.group.add'
                                variant='info'
                                icon={ mdiPlus }
                                className='w-fit'/>
                    }>
                <Input.Text id='name'
                            title='TransactionRule.name'
                            type='text'
                            required/>
            </Dialog>
        </Form>
    </>
}

export default GroupAddDialog