import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import React, { FC, useRef } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import AccountRepository from "../../core/repositories/account-repository";
import NotificationService from "../../service/notification.service";
import { Account } from "../../types/types";
import { confirmDeleteDialog } from "../confirm-dialog";
import { Button } from "../layout/button";

type AccountMenuProps = {
  account: Account,
  callback: () => void
}

/**
 * `AccountMenu` is a functional component that renders a contextual menu for performing actions
 * associated with an account. The menu provides options such as editing or deleting the account.
 * It accepts an account object and a callback function as props.
 */
const AccountMenu: FC<AccountMenuProps> = ({ account, callback }) => {
  const actionMenu = useRef<Menu>(null);
  const navigate = useNavigate();

  const menuOptions = [
    {
      icon: () => <Icon path={ mdiSquareEditOutline } size={ 1 }/>,
      label: i10n('common.action.edit'),
      command() {
        navigate(`./${ account.id }/edit`)
      }
    },
    {
      icon: () => <Icon path={ mdiTrashCanOutline } size={ 1 }/>,
      className: '[&>div>a]:!text-red-600 [&>div>a>.p-menuitem-text]:!text-red-600',
      label: i10n('common.action.delete'),
      command() {
        confirmDeleteDialog({
          message: i10n('page.accounts.delete.confirm'),
          accept: () => {
            AccountRepository.delete(account.id)
              .then(() => NotificationService.success('page.account.delete.success'))
              .then(() => callback())
              .catch(() => NotificationService.warning('page.account.delete.failed'))
          }
        })
      }
    }
  ] as MenuItem[]

  return <>
    <Menu popup popupAlignment='right' ref={ actionMenu } model={ menuOptions }/>
    <Button icon={ mdiDotsVertical }
            text
            className='!border-none'
            onClick={ (event) => actionMenu?.current?.toggle(event) }
            aria-controls="popup_menu_right" aria-haspopup/>
  </>
}

export default AccountMenu
