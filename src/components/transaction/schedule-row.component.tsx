import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React, { Attributes } from "react";
import { NavLink } from "react-router-dom";
import { Resolver, When } from "../../core";

import { TransactionScheduleRepository } from "../../core/RestAPI";
import NotificationService from "../../service/notification.service";
import { Date, Money } from "../../core/Formatters";
import { Button } from "../layout/button";
import { Dropdown } from "../layout/dropdown";

import ConfirmComponent from "../layout/popup/confirm.component";
import Translation from "../localization/translation.component";

type ScheduledTransactionRowProps = Attributes & {
    schedule: any,
    deleteCallback: () => void
}

const ScheduledTransactionRow = ({ schedule, deleteCallback }: ScheduledTransactionRowProps) => {

    const onDelete = () => TransactionScheduleRepository.delete(schedule)
        .then(() => NotificationService.success('page.budget.schedule.delete.success'))
        .then(() => deleteCallback())
        .catch(() => NotificationService.warning('page.budget.schedule.delete.failed'))

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
                    <Date date={schedule.range.start}/> - <Formats.Date date={schedule.range.end}/>
                </When>
            </td>
            <td><NavLink to={Resolver.Account.resolveUrl(schedule.source) + '/transactions'}>{schedule.source.name}</NavLink></td>
            <td><NavLink to={Resolver.Account.resolveUrl(schedule.destination) + '/transactions'}>{schedule.destination.name}</NavLink></td>
            <td><Money money={schedule.amount} currency={schedule.source.currency}/></td>
            <td>
                <Dropdown icon={mdiDotsVertical}
                                   actions={dropDownActions}>
                    <Button label='common.action.edit'
                                    variant='primary'
                                    icon={mdiSquareEditOutline}
                                    href={`./${schedule.id}/edit`}/>
                    <ConfirmComponent title='common.action.delete'
                                             openButton={<Button label='common.action.delete'
                                                                         variant='warning'
                                                                         icon={mdiTrashCanOutline}/>}
                                             onConfirm={onDelete}>
                        <Translation label='page.budget.schedule.delete.confirm'/>
                    </ConfirmComponent>
                </Dropdown>
            </td>
        </tr>
    )
}

export default ScheduledTransactionRow