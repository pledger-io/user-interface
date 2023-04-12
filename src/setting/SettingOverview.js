import {BreadCrumbItem, BreadCrumbs, Buttons, Dialog, Layout, Translations} from "../core";
import React, {useEffect, useState} from "react";
import {SettingRepository} from "../core/RestAPI";
import {mdiContentSave, mdiPencilBoxOutline} from "@mdi/js";
import {Form, Input, SubmitButton} from "../core/form";

export const SettingOverviewComponent = () => {
    const [settings, setSettings]   = useState([])

    useEffect(() => {
        SettingRepository.list()
            .then(setSettings)
    }, [])

    const control = {
        close: () => undefined
    }
    const onUpdate = entity => SettingRepository.update(entity.name, entity.value)
            .then(control.close)

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
        </BreadCrumbs>

        <Layout.Card title='page.header.application.settings'>
            <table className='Table'>
                <thead>
                <tr>
                    <th/>
                    <th><Translations.Translation label='Setting.name' /></th>
                    <th><Translations.Translation label='Setting.type' /></th>
                    <th><Translations.Translation label='Setting.currentValue' /></th>
                </tr>
                </thead>
                <tbody>
                {settings.map(setting =>
                    <tr key={setting.id}>
                        <td width='25'>
                            <Form onSubmit={onUpdate} entity='Setting'>
                                <Dialog.Dialog title='page.application.setting.edit'
                                               className='Large'
                                               control={control}
                                               openButton={<Buttons.Button icon={mdiPencilBoxOutline}
                                                                           variant='icon' />}
                                               actions={[<SubmitButton label='common.action.save' icon={mdiContentSave} key='save'/>]}>
                                    <Input.Hidden value={setting.name} id='name' />
                                    {setting.type === 'NUMBER' &&
                                        <Input.Text id='value'
                                                    title={`page.setting.overview.setting.${setting.name}`}
                                                    value={setting.value} />}
                                    {setting.type === 'FLAG' && <>
                                        <Translations.Translation label={`page.setting.overview.setting.${setting.name}`} />
                                        <Input.Toggle id='value'
                                                      value={setting.value}/>
                                    </>}
                                </Dialog.Dialog>
                            </Form>
                        </td>
                        <td><Translations.Translation label={`page.setting.overview.setting.${setting.name}`}/></td>
                        <td>{setting.type}</td>
                        <td>{setting.value}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </Layout.Card>
    </>
}
