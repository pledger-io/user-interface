import React from "react";
import PropTypes from 'prop-types'
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Dialog,
    Dropdown,
    Formats, Notifications,
    Resolver,
    Translations,
    When
} from "../../core";
import restAPI from "../../core/RestAPI";
import {EntityShapes} from "../../config";
import {NavLink} from "react-router-dom";
import {mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import {ScheduleTransactionDialog} from "./ScheduleTransactionDialog";

class ScheduledTransactionService {
    list() {
        return restAPI.get('schedule/transaction')
    }

    delete({id}) {
        return restAPI.delete(`schedule/transaction/${id}`)
    }
}

const service = new ScheduledTransactionService()

class ScheduledTransactionRow extends React.Component {
    static propTypes = {
        schedule: EntityShapes.TransactionSchedule,
        onDelete: PropTypes.func
    }

    dropDownActions = {
        close: () => {}
    }

    render() {
        const {schedule} = this.props

        return (
            <tr className='ScheduledTransactionRow' onMouseLeave={() => this.dropDownActions.close()}>
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
                                       actions={this.dropDownActions}>
                        <Buttons.Button label='common.action.edit'
                                        variant='primary'
                                        icon={mdiSquareEditOutline}
                                        href={`./${schedule.id}/edit`}/>
                        <Dialog.ConfirmPopup title='common.action.delete'
                                             openButton={<Buttons.Button label='common.action.delete'
                                                                         variant='warning'
                                                                         icon={mdiTrashCanOutline}/>}
                                             onConfirm={this.delete.bind(this)}>
                            <Translations.Translation label='page.budget.schedule.delete.confirm'/>
                        </Dialog.ConfirmPopup>
                    </Dropdown.Dropdown>
                </td>
            </tr>
        )
    }

    delete() {
        const {schedule, onDelete = () => {}} = this.props

        service.delete(schedule)
            .then(() => Notifications.Service.success('page.budget.schedule.delete.success'))
            .then(() => onDelete())
            .catch(() => Notifications.Service.warning('page.budget.schedule.delete.failed'))
    }
}

class ScheduledTransactionOverview extends React.Component {

    loaded = false;
    state = {
        schedules: [],
    }

    refresh() {
        service.list()
            .then(schedules => this.setState({
                schedules: schedules
            }))
    }

    render() {
        const {schedules} = this.state
        if (!this.loaded) {
            this.loaded = true
            this.refresh();
        }

        const scheduleRows = (schedules || [])
            .filter(schedule => schedule.source && schedule.destination)
            .map(schedule => <ScheduledTransactionRow schedule={schedule}
                                                      onDelete={() => this.refresh()}
                                                      key={schedule.id}/>)

        return (
            <div className="ScheduledTransactionOverview">
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.accounting'/>
                    <BreadCrumbItem label='page.nav.automation'/>
                    <BreadCrumbItem label='page.nav.budget.recurring'/>
                </BreadCrumbs>

                <Card title='page.budget.schedules.title'
                      actions={[<ScheduleTransactionDialog key='schedule-dialog' />]}>
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
                        {scheduleRows}
                        </tbody>
                    </table>
                </Card>
            </div>
        )
    }
}

export {
    ScheduledTransactionOverview
}
