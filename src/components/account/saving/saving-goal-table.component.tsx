import { mdiDotsVertical, mdiPencilBoxOutline, mdiPlusBox, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { ProgressBar } from "primereact/progressbar";
import React, { FC, useRef, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import AccountRepository from "../../../core/repositories/account-repository";
import SavingsRepository from "../../../core/repositories/savings-repository";
import { Account, DialogOptions, SavingGoal } from "../../../types/types";
import { confirmDeleteDialog } from "../../confirm-dialog";
import MoneyComponent from "../../format/money.component";
import { Button } from "../../layout/button";
import ReserveToGoalComponent from "./reserve-money.component";
import EditSavingGoalComponent from "./saving-goal-form.component";

type SavingGoalTableComponentProps = {
  account: Account
}

type SavedSoFarColumnProps = {
  savingGoal: SavingGoal,
  account: Account,
  onUpdated: (_: Account) => void
}

const SavedSoFarColumn: FC<SavedSoFarColumnProps> = ({ savingGoal, account, onUpdated }) => {
  const addReservationRef = useRef<DialogOptions>(null)

  return <div className='flex items-center'>
    <ProgressBar value={ savingGoal.reserved / savingGoal.goal } className='flex-grow'/>
    <Button icon={ mdiPlusBox } severity='help' text size='small' onClick={ () => addReservationRef.current?.open() }/>
    <ReserveToGoalComponent account={ account }
                            savingGoal={ savingGoal }
                            onChanged={ onUpdated }
                            ref={ addReservationRef }/>
  </div>
}

type SavingActionMenuProps = {
  account: Account
  savingGoal: SavingGoal,
  callback: (_: Account) => void
}
const SavingActionMenu: FC<SavingActionMenuProps> = ({ account, savingGoal, callback }) => {
  const actionMenu = useRef<Menu>(null);
  const editSavingRef = useRef<DialogOptions>(null);
  const { success, warning } = useNotification();

  const menuOptions = [
    {
      icon: () => <Icon path={ mdiSquareEditOutline } size={ 1 }/>,
      label: i10n('common.action.edit'),
      command: () => editSavingRef.current?.open()
    },
    {
      icon: () => <Icon path={ mdiTrashCanOutline } size={ 1 }/>,
      label: i10n('page.account.saving.stop'),
      command() {
        confirmDeleteDialog({
          message: i10n('page.accounts.delete.confirm'),
          accept: () => {
            SavingsRepository.delete(account.id, savingGoal.id)
              .then(() => AccountRepository.get(account.id).then(callback))
              .then(() => success('page.account.saving.goal.ended'))
              .catch(() => warning('page.account.saving.goal.endingFail'))
          }
        })
      }
    }
  ] as MenuItem[]

  return <>
    <Menu popup popupAlignment='right' ref={ actionMenu } model={ menuOptions }/>
    <EditSavingGoalComponent account={ account } savingGoal={ savingGoal } onChanged={ callback } ref={ editSavingRef }/>
    <Button icon={ mdiDotsVertical }
            text
            className='!border-none'
            onClick={ (event) => actionMenu?.current?.toggle(event) }
            aria-controls="popup_menu_right" aria-haspopup/>
  </>
}

const SavingGoalTableComponent = ({ account }: SavingGoalTableComponentProps) => {
  const [goals, setGoals] = useState(() => account.savingGoals)
  const editSavingRef = useRef<DialogOptions>(null)

  const onUpdated = (updatedAccount: Account) => setGoals(updatedAccount.savingGoals)

  return <>
    <div className='flex justify-end mb-4'>
      <Button label='page.account.savings.new'
              size='small'
              icon={ mdiPencilBoxOutline }
              onClick={ () => editSavingRef.current?.open() }
              severity='success'/>
      <EditSavingGoalComponent account={ account } onChanged={ onUpdated } ref={ editSavingRef }/>
    </div>

    <DataTable value={ goals } size='small'>
      <Column field='name' header={ i10n('SavingGoal.goal') }/>
      <Column body={ savingGoal =>
        <SavedSoFarColumn savingGoal={ savingGoal } account={ account } onUpdated={ onUpdated } />}
              header={ i10n('page.account.saving.soFar') }/>
      <Column body={ savingGoal =>
        <MoneyComponent money={ savingGoal.goal } currency={ account.account.currency }/> }
              header={ i10n('SavingGoal.goal') }/>
      <Column body={ savingGoal =>
        <MoneyComponent money={ savingGoal.goal - savingGoal.reserved } currency={ account.account.currency }/> }
              header={ i10n('page.account.saving.remaining') }/>
      <Column body={ savingGoal =>
        <MoneyComponent money={ (savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft }
                        currency={ account.account.currency }/> }
              header={ i10n('page.account.saving.suggestedSaving') }/>
      <Column body={ savingGoal =>
        <SavingActionMenu account={ account } savingGoal={ savingGoal } callback={ onUpdated } /> }
              bodyClassName='w-[5rem]'/>
    </DataTable>
  </>
}

export default SavingGoalTableComponent
