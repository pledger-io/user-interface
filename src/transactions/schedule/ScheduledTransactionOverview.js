import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types'
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Dialog,
    Dropdown,
    Formats,
    Layout,
    Loading,
    Notifications,
    Resolver,
    Translations,
    When
} from "../../core";
import {TransactionScheduleRepository} from "../../core/RestAPI";
import {EntityShapes} from "../../config";
import {NavLink} from "react-router-dom";
import {mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import {ScheduleTransactionDialog} from "./ScheduleTransactionDialog";


const ScheduledTransactionRow = ({schedule, deleteCallback}) => {

    const onDelete = () => TransactionScheduleRepository.delete(schedule)
        .then(() => Notifications.Service.success('page.budget.schedule.delete.success'))
        .then(() => deleteCallback())
        .catch(() => Notifications.Service.warning('page.budget.schedule.delete.failed'))

    const dropDownActions = {
        close: () => {}
    }

    return (
        <tr className='ScheduledTransactionRow' onMouseLeave={() => dropDownActions.close()}>
            <td>
                {schedule.name}
                {schedule.description != null && <div className='Description'>{schedule.description}</div>}
            </td>
            <td>
                <When condition={schedule.range.start != null}>
                    <Formats.Date date={schedule.range.start}/> - <Formats.Date date={schedule.range.end}/>
                </When>
            </td>
            <td><NavLink to={Resolver.Account.resolveUrl(schedule.source) + '/transactions'}>{schedule.source.name}</NavLink></td>
            <td><NavLink to={Resolver.Account.resolveUrl(schedule.destination) + '/transactions'}>{schedule.destination.name}</NavLink></td>
            <td><Formats.Money money={schedule.amount} currency={schedule.source.currency}/></td>
            <td>
                <Dropdown.Dropdown icon={mdiDotsVertical}
                                   actions={dropDownActions}>
                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    icon={mdiSquareEditOutline}
                                    href={`./${schedule.id}/edit`}/>
                    <Dialog.ConfirmPopup title='common.action.delete'
                                         openButton={<Buttons.Button label='common.action.delete'
                                                                     variant='warning'
                                                                     icon={mdiTrashCanOutline}/>}
                                         onConfirm={onDelete}>
                        <Translations.Translation label='page.budget.schedule.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown.Dropdown>
            </td>
        </tr>
    )
}
ScheduledTransactionRow.propTypes = {
    schedule: EntityShapes.TransactionSchedule,
    deleteCallback: PropTypes.func
}

export const ScheduledTransactionOverview = () => {
    const [schedules, setSchedules] = useState(undefined)

    const loadSchedules = () => TransactionScheduleRepository.list().then(setSchedules)
    useEffect(() => {
        loadSchedules()
    }, [])

    return (
        <div className="ScheduledTransactionOverview">
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.accounting'/>
                <BreadCrumbItem label='page.nav.automation'/>
                <BreadCrumbItem label='page.nav.budget.recurring'/>
            </BreadCrumbs>

            <Layout.Card title='page.budget.schedules.title'
                  actions={[<ScheduleTransactionDialog key='schedule-dialog' />]}>
                <Loading condition={schedules}>
                    <table className='Table'>
                        <thead>
                        <tr>
                            <th><Translations.Translation label='ScheduledTransaction.name'/></th>
                            <th><Translations.Translation label='page.budget.schedule.daterange'/></th>
                            <th><Translations.Translation label='ScheduledTransaction.source'/></th>
                            <th><Translations.Translation label='ScheduledTransaction.destination'/></th>
                            <th><Translations.Translation label='ScheduledTransaction.amount'/></th>
                            <th width='20'/>
                        </tr>
                        </thead>
                        <tbody>
                        {schedules && schedules.filter(schedule => schedule.source && schedule.destination)
                            .map(schedule => <ScheduledTransactionRow schedule={schedule}
                                                                      onDelete={loadSchedules}
                                                                      key={schedule.id}/>)}
                        </tbody>
                    </table>
                </Loading>
            </Layout.Card>
        </div>)
}
