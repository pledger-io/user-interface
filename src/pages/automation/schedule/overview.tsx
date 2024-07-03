import React, { useEffect, useState } from "react";

import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";
import Translation from "../../../components/localization/translation.component";
import ScheduleTransactionDialog from "../../../components/transaction/schedule-dialog.component";
import ScheduledTransactionRow from "../../../components/transaction/schedule-row.component";

import { TransactionScheduleRepository } from "../../../core/RestAPI";

const ScheduledTransactionOverview = () => {
    const [schedules, setSchedules] = useState<any[] | undefined>(undefined)

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

            <Card title='page.budget.schedules.title'
                  actions={ [<ScheduleTransactionDialog key='schedule-dialog' onCreated={ loadSchedules }/>] }>
                <Loading condition={ schedules !== undefined }>
                    <table className='Table'>
                        <thead>
                        <tr>
                            <th><Translation label='ScheduledTransaction.name'/></th>
                            <th><Translation label='page.budget.schedule.daterange'/></th>
                            <th><Translation label='ScheduledTransaction.source'/></th>
                            <th><Translation label='ScheduledTransaction.destination'/></th>
                            <th><Translation label='ScheduledTransaction.amount'/></th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        { schedules
                            ?.filter((schedule: any) => schedule.source && schedule.destination)
                            .map((schedule: any) => <ScheduledTransactionRow schedule={ schedule }
                                                                      deleteCallback={ loadSchedules }
                                                                      key={ schedule.id }/>) }
                        </tbody>
                    </table>
                </Loading>
            </Card>
        </div>)
}

export default ScheduledTransactionOverview