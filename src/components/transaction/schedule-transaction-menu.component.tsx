import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import React, { FC, useRef } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import { TransactionScheduleRepository } from "../../core/RestAPI";
import { Button } from "../layout/button";

type AccountMenuProps = {
  schedule: any,
  callback: () => void
}

/**
 * `AccountMenu` is a functional component that renders a contextual menu for performing actions
 * associated with an account. The menu provides options such as editing or deleting the account.
 * It accepts an account object and a callback function as props.
 */
const ScheduleTransactionMenu: FC<AccountMenuProps> = ({ schedule, callback }) => {
  const actionMenu = useRef<Menu>(null);
  const navigate = useNavigate();
  const { success, warning } = useNotification();

  const menuOptions = [
    {
      icon: () => <Icon path={ mdiSquareEditOutline } size={ 1 }/>,
      label: i10n('common.action.edit'),
      command() {
        navigate(`./${ schedule.id }/edit`)
      }
    },
    {
      icon: () => <Icon path={ mdiTrashCanOutline } size={ 1 }/>,
      label: i10n('common.action.delete'),
      className: '[&>div>a]:!text-red-600 [&>div>a>.p-menuitem-text]:!text-red-600',
      command() {
        confirmDialog({
          message: i10n('page.budget.schedule.delete.confirm'),
          header: i10n('common.action.delete'),
          defaultFocus: 'reject',
          acceptClassName: 'p-button-danger',
          accept: () => {
            TransactionScheduleRepository.delete(schedule)
              .then(() => success('page.budget.schedule.delete.success'))
              .then(() => callback())
              .catch(() => warning('page.budget.schedule.delete.failed'))
          }
        });
      }
    }
  ] as MenuItem[]

  return <>
    <Menu popup popupAlignment='right' ref={ actionMenu } model={ menuOptions }/>
    <Button icon={ mdiDotsVertical }
            outlined={ true }
            className='!border-none'
            onClick={ (event) => actionMenu?.current?.toggle(event) }
            aria-controls="popup_menu_right" aria-haspopup/>
  </>
}

export default ScheduleTransactionMenu
