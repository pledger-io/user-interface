import {Dialog} from "../../core/popups";
import {mdiContentSave, mdiPlus} from "@mdi/js";
import {Buttons, Notifications} from "../../core";
import React from "react";
import {Form, Input, SubmitButton} from "../../core/form";
import RuleRepository from "../../core/repositories/rule-repository";

type GroupAddDialogProps = {
    onAdd: () => void
}

const GroupAddDialog = (props: GroupAddDialogProps) => {
    const dialogControl = {close: () => undefined}
    const onSubmit = (data: any) =>
        RuleRepository.createGroup(data.name)
            .then(props.onAdd)
            .then(() => dialogControl.close())
            .catch(() => Notifications.Service.warning('page.settings.rules.group.add.error'))

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
                        <Buttons.Button label='page.settings.rules.group.add'
                                        variant='info'
                                        icon={mdiPlus}
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