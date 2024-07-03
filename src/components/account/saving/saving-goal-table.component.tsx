import React, { useState } from "react";
import SavingsRepository from "../../../core/repositories/savings-repository";
import { Progressbar } from "../../../core";
import { mdiDotsVertical, mdiPencilBoxOutline, mdiPiggyBankOutline, mdiTrashCanOutline } from "@mdi/js";
import { Account, SavingGoal } from "../../../core/types";
import NotificationService from "../../../service/notification.service";
import MoneyComponent from "../../format/money.component";
import { Button } from "../../layout/button";
import { Dropdown } from "../../layout/dropdown";
import { Confirm } from "../../layout/popup";
import Translation from "../../localization/translation.component";

import ReserveToGoalComponent from "./reserve-money.component";
import EditSavingGoalComponent from "./saving-goal-form.component";
import Loading from "../../layout/loading.component";

type SavingGoalTableComponentProps = {
    account: Account
}

const SavingGoalTableComponent = ({ account }: SavingGoalTableComponentProps) => {
    const [goals, setGoals] = useState(() => account.savingGoals)

    const onUpdated = (updatedAccount: Account) => setGoals(updatedAccount.savingGoals)
    const onDelete = (toDelete: SavingGoal) => SavingsRepository.delete(account.id, toDelete.id)
        .then(() => NotificationService.success('page.account.saving.goal.ended'))
        .then(() => setGoals(goals.filter(goal => goal.id !== toDelete.id)))
        .catch(() => NotificationService.warning('page.account.saving.goal.endingFail'))

    if (!account) return <Loading/>
    return <>
        <table className='Table SavingGoals'>
            <thead>
            <tr>
                <th><Translation label='SavingGoal.goal'/></th>
                <th><Translation label='page.account.saving.soFar'/></th>
                <th><Translation label='SavingGoal.goal'/></th>
                <th><Translation label='page.account.saving.remaining'/></th>
                <th><Translation label='page.account.saving.suggestedSaving'/></th>
                <th/>
            </tr>
            </thead>
            <tbody>
            { (goals === undefined || goals.length === 0) && <tr>
                <td colSpan={ 5 } className='text-center'>
                    <Translation label="common.overview.noresults"/>
                </td>
            </tr> }

            { goals?.map(savingGoal => <tr key={ savingGoal.id }>
                <td>{ savingGoal.name }</td>
                <td className='grid grid-cols-10'>
                    <div className='col-span-9'>
                        <Progressbar total={ savingGoal.goal } current={ savingGoal.reserved }/>
                    </div>
                    <ReserveToGoalComponent savingGoal={ savingGoal }
                                            onChanged={ onUpdated }
                                            account={ account }/>
                </td>
                <td>
                    <MoneyComponent money={ savingGoal.goal }
                                   currency={ account.account.currency }/>
                </td>
                <td>
                    <MoneyComponent money={ savingGoal.goal - savingGoal.reserved }
                                   currency={ account.account.currency }/>
                </td>
                <td>
                    <MoneyComponent money={ (savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft }
                                   currency={ account.account.currency }/>
                </td>
                <td>
                    <Dropdown icon={ mdiDotsVertical }>
                        <EditSavingGoalComponent account={ account }
                                                 openButton={ <Button label='page.account.saving.update'
                                                                      icon={ mdiPencilBoxOutline }
                                                                      variant='primary'/> }
                                                 savingGoal={ savingGoal }
                                                 onChanged={ onUpdated }/>

                        <Confirm title='page.account.saving.stop'
                                 openButton={ <Button label='page.account.saving.stop'
                                                      icon={ mdiTrashCanOutline }
                                                      variant='warning'/> }
                                 onConfirm={ () => onDelete(savingGoal) }>
                            <Translation label='page.account.saving.stop.message'/>
                        </Confirm>
                    </Dropdown>
                </td>
            </tr>) }
            </tbody>
        </table>

        <EditSavingGoalComponent account={ account }
                                 openButton={ <Button label='page.account.savings.new'
                                                      icon={ mdiPiggyBankOutline }/> }
                                 onChanged={ onUpdated }/>
    </>
}

export default SavingGoalTableComponent