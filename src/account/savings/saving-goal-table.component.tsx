import React, {useState} from "react";
import SavingsRepository from "../../core/repositories/savings-repository";
import {Buttons, Dialog, Dropdown, Formats, Layout, Notifications, Progressbar, Translations} from "../../core";
import {mdiDotsVertical, mdiPencilBoxOutline, mdiPiggyBankOutline, mdiTrashCanOutline} from "@mdi/js";
import {Account, SavingGoal} from "../../core/types";
import ReserveToGoalComponent from "./reserve-money.component";
import EditSavingGoalComponent from "./saving-goal-form.component";

type SavingGoalTableComponentProps = {
    account : Account
}

const SavingGoalTableComponent = ({account} : SavingGoalTableComponentProps) => {
    const [goals, setGoals] = useState(() => account.savingGoals)

    const onUpdated = (updatedAccount: Account) => setGoals(updatedAccount.savingGoals)
    const onDelete = (toDelete: SavingGoal) => SavingsRepository.delete(account.id, toDelete.id)
        .then(() => Notifications.Service.success('page.account.saving.goal.ended'))
        .then(() => setGoals(goals.filter(goal => goal.id !== toDelete.id)))
        .catch(() => Notifications.Service.warning('page.account.saving.goal.endingFail'))

    if (!account) return <Layout.Loading />
    return <>
        <table className='Table SavingGoals'>
            <thead>
            <tr>
                <th><Translations.Translation label='SavingGoal.goal'/></th>
                <th><Translations.Translation label='page.account.saving.soFar'/></th>
                <th><Translations.Translation label='SavingGoal.goal'/></th>
                <th><Translations.Translation label='page.account.saving.remaining'/></th>
                <th><Translations.Translation label='page.account.saving.suggestedSaving'/></th>
                <th />
            </tr>
            </thead>
            <tbody>
            { goals.length === 0 && <tr><td colSpan={ 5 } className='text-center'>
                <Translations.Translation label="common.overview.noresults"/>
            </td></tr> }

            { goals.map(savingGoal => <tr key={ savingGoal.id }>
                <td>{ savingGoal.name }</td>
                <td className='grid grid-cols-10'>
                    <div className='col-span-9'>
                        <Progressbar total={ savingGoal.goal } current={ savingGoal.reserved } />
                    </div>
                    <ReserveToGoalComponent savingGoal={ savingGoal }
                                        onChanged={ onUpdated }
                                        account={ account } />
                </td>
                <td>
                    <Formats.Money money={ savingGoal.goal }
                                   currency={ account.account.currency }/>
                </td>
                <td>
                    <Formats.Money money={ savingGoal.goal - savingGoal.reserved }
                                   currency={ account.account.currency }/>
                </td>
                <td>
                    <Formats.Money money={ (savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft }
                                   currency={ account.account.currency }/>
                </td>
                <td>
                    <Dropdown.Dropdown icon={mdiDotsVertical}>
                        <EditSavingGoalComponent account={ account }
                                                 openButton={ <Buttons.Button label='page.account.saving.update'
                                                                             icon={ mdiPencilBoxOutline }
                                                                             variant='primary'/> }
                                                 savingGoal={ savingGoal }
                                                 onChanged={ onUpdated }/>

                        <Dialog.ConfirmPopup title='page.account.saving.stop'
                                             openButton={ <Buttons.Button label='page.account.saving.stop'
                                                                         icon={ mdiTrashCanOutline }
                                                                         variant='warning'/> }
                                             onConfirm={ () => onDelete(savingGoal) }>
                            <Translations.Translation label='page.account.saving.stop.message'/>
                        </Dialog.ConfirmPopup>
                    </Dropdown.Dropdown>
                </td>
            </tr>)}
            </tbody>
        </table>

        <EditSavingGoalComponent account={account}
                                 openButton={ <Buttons.Button label='page.account.savings.new'
                                                              icon={ mdiPiggyBankOutline } /> }
                                 onChanged={onUpdated}/>
    </>
}

export default SavingGoalTableComponent