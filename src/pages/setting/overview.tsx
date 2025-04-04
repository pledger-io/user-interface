import React, { FC, useEffect, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../components/layout/button";
import { SettingRepository } from "../../core/RestAPI";
import { mdiContentSave, mdiPencilBoxOutline } from "@mdi/js";
import { Form, Input, SubmitButton } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

type Setting = {
    id: number
    name: string
    type: string
    value: string
}

const SettingActionButtons: FC<{setting: Setting, callback: () => void}> = ({ setting, callback }) => {
    const [visible, setVisible] = React.useState(false);

    const onUpdate = (entity: any) => SettingRepository.update(entity.name, entity.value)
        .then(callback)
        .then(() => setVisible(false))

    return <div className='flex gap-2 justify-end'>
        <Button icon={ mdiPencilBoxOutline } text onClick={ () => setVisible(true) } />
        <Dialog header={ i10n('page.application.setting.edit') }
                onHide={ () => setVisible(false) }
                visible={ visible }>
            <Form onSubmit={ onUpdate } entity='Setting'>
                <Input.Hidden value={ setting.name } id='name'/>
                { setting.type === 'NUMBER' &&
                    <Input.Text id='value'
                                type='text'
                                title={ `page.setting.overview.setting.${ setting.name }` }
                                value={ setting.value }/> }
                { setting.type === 'FLAG' && <>
                    { i10n(`page.setting.overview.setting.${ setting.name }`) }
                    <Input.Toggle id='value' value={ setting.value == 'true' }/>
                </> }

                <div className='flex justify-end my-4'>
                    <SubmitButton label='common.action.save'
                                  icon={ mdiContentSave }
                                  key='save'/>
                </div>
            </Form>
        </Dialog>
    </div>
}

const SettingPage = () => {
    const [settings, setSettings] = useState<Setting[]>([])

    const loadSettings = () => {
        SettingRepository.list()
            .then(setSettings)
    }
    useEffect(() => {
        loadSettings()
    }, [])


    const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
        { i10n('page.header.application.settings') }
    </div>

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
        </BreadCrumbs>

        <ConfirmDialog className='max-w-[25rem]'/>

        <Card header={ header } className='my-4 mx-2'>
            <DataTable value={ settings } loading={ !settings } size='small'>
                <Column header={ i10n('Setting.name') } body={ setting => i10n(`page.setting.overview.setting.${ setting.name }`)}/>
                <Column field='type' header={ i10n('Setting.type') }/>
                <Column field='value' header={ i10n('Setting.currentValue') }/>
                <Column className='max-w-[2rem]' body={ setting => <SettingActionButtons setting={ setting } callback={ loadSettings }/> } />
            </DataTable>
        </Card>
    </>
}

export default SettingPage