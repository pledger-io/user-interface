import { Dialog } from "../../core/popups";
import { mdiBagChecked, mdiDelete, mdiHammer, mdiRedo } from "@mdi/js";
import { Buttons, Formats, Layout, Message, Translations } from "../../core";
import React, { useEffect, useState } from "react";
import ProcessRepository, { ProcessInstance, ProcessVariable } from "../../core/repositories/process.repository";

const ReconcileRowComponent = ({ process } : { process : ProcessInstance }) => {
    const [variables, setVariables] = useState<ProcessVariable[]>()

    useEffect(() => {
        ProcessRepository.variables('AccountReconcile', process.businessKey, process.id)
            .then(setVariables)
    }, [process])

    if (!variables) {
        return <tr><td colSpan={ 5 }><Layout.Loading /></td></tr>
    }

    const findValue = (name: string) => variables.find(variable => variable.name === name)?.value
    return <>
        <tr>
            <td className='flex gap-0.5'>
                <Buttons.Button variant='icon' icon={ mdiHammer } className='text-primary'/>
                <Buttons.Button variant='icon' icon={ mdiRedo } className='text-success' />
                <Buttons.Button variant='icon' icon={ mdiDelete } className='text-warning' />
            </td>
            <td>{ findValue('startDate').substring(0, 4) }</td>
            <td><Formats.Money money={findValue('openBalance') } /></td>
            <td><Formats.Money money={findValue('computedStartBalance') } /></td>
            <td><Formats.Money money={findValue('endBalance') } /></td>
            <td><Formats.Money money={findValue('computedEndBalance') } /></td>
            <td></td>
        </tr>
    </>
}

const ReconcileOverviewComponent = ({ processes } : { processes : ProcessInstance[] }) => {
    return <>
        <Dialog title='page.accounts.reconcile.active'
                className='Large'
                openButton={
                    <Buttons.Button label='page.accounts.reconcile.active' icon={ mdiBagChecked }/>
                }>

            <Message label='page.accounts.reconcile.active.explained' />

            <table className='Table'>
                <thead>
                <tr>
                    <th rowSpan={ 2 } className='w-4' />
                    <th rowSpan={ 2 }>
                        <Translations.Translation label='common.year' />
                    </th>
                    <th colSpan={ 2 }>
                        <Translations.Translation label='common.start' />
                    </th>
                    <th colSpan={ 2 }>
                        <Translations.Translation label='common.end' />
                    </th>
                </tr>
                <tr>
                    <th><Translations.Translation label='common.expected'/></th>
                    <th><Translations.Translation label='common.actual'/></th>
                    <th><Translations.Translation label='common.expected'/></th>
                    <th><Translations.Translation label='common.actual'/></th>
                </tr>
                </thead>
                <tbody>
                { processes.map(process => <ReconcileRowComponent process={ process } />) }
                </tbody>
            </table>

        </Dialog>
    </>
}

export default ReconcileOverviewComponent