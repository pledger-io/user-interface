import React, { useEffect, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../components/layout/button";
import Card from "../../components/layout/card.component";
import { Dialog } from "../../components/layout/popup";
import { PopupCallbacks } from "../../components/layout/popup/popup.component";
import Translation from "../../components/localization/translation.component";
import { SettingRepository } from "../../core/RestAPI";
import { mdiContentSave, mdiPencilBoxOutline } from "@mdi/js";
import { Form, Input, SubmitButton } from "../../components/form";

type Setting = {
    id: number
    name: string
    type: string
    value: string
}

const _ = () => {
    const [settings, setSettings] = useState<Setting[]>([])

    useEffect(() => {
        SettingRepository.list()
            .then(setSettings)
    }, [])

    const control: PopupCallbacks = { close: () => null, open: () => null }
    const onUpdate = (entity: any) => SettingRepository.update(entity.name, entity.value)
        .then(control.close)

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
        </BreadCrumbs>

        <Card title='page.header.application.settings'>
            <table className='Table'>
                <thead>
                <tr>
                    <th/>
                    <th><Translation label='Setting.name'/></th>
                    <th><Translation label='Setting.type'/></th>
                    <th><Translation label='Setting.currentValue'/></th>
                </tr>
                </thead>
                <tbody>
                { settings.map(setting =>
                    <tr key={ setting.id }>
                        <td width='25'>
                            <Form onSubmit={ onUpdate } entity='Setting'>
                                <Dialog title='page.application.setting.edit'
                                        className='Large'
                                        control={ control }
                                        openButton={ <Button icon={ mdiPencilBoxOutline }
                                                             variant='icon'/> }
                                        actions={ [<SubmitButton label='common.action.save'
                                                                 icon={ mdiContentSave }
                                                                 key='save'/>] }>
                                    <Input.Hidden value={ setting.name } id='name'/>
                                    { setting.type === 'NUMBER' &&
                                        <Input.Text id='value'
                                                    type='text'
                                                    title={ `page.setting.overview.setting.${ setting.name }` }
                                                    value={ setting.value }/> }
                                    { setting.type === 'FLAG' && <>
                                        <Translation label={ `page.setting.overview.setting.${ setting.name }` }/>
                                        <Input.Toggle id='value'
                                                      value={ setting.value == 'true' }/>
                                    </> }
                                </Dialog>
                            </Form>
                        </td>
                        <td><Translation label={ `page.setting.overview.setting.${ setting.name }` }/></td>
                        <td>{ setting.type }</td>
                        <td>{ setting.value }</td>
                    </tr>
                ) }
                </tbody>
            </table>
        </Card>
    </>
}

export default _