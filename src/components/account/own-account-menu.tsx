import { mdiBagChecked, mdiCheck, mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import AccountRepository from "../../core/repositories/account-repository";
import ProcessRepository, { BusinessKey, ProcessInstance } from "../../core/repositories/process.repository";
import NotificationService from "../../service/notification.service";
import { Account, Identifier } from "../../types/types";
import { Button } from "../layout/button";
import ReconcileOverviewComponent from "./reconcile/reconcile-overview.component";
import ReconcileStartComponent from "./reconcile/reconcile-start.component";

const loadReconcileActivity = (accountId: Identifier, callback: (process: ProcessInstance[]) => void) => {
  ProcessRepository.historyForKey('AccountReconcile', accountId as BusinessKey)
    .then(processes => processes.filter(process => process.state === 'ACTIVE'))
    .then(callback)
}

type OwnAccountMenuProps = {
  account: Account,
  callback: () => void
}

const OwnAccountMenu: FC<OwnAccountMenuProps> = ({ account, callback }) => {
  const actionMenu = useRef<Menu>(null);
  const reconcileStartRef = useRef<any>(null)
  const reconcileOverviewRef = useRef<any>(null)
  const navigate = useNavigate();
  const [reconcileActivity, setReconcileActivity] = useState<ProcessInstance[]>([])

  useEffect(() => {
    if (account.id) loadReconcileActivity(account.id, setReconcileActivity)
  }, [account.id])

  let reconcileOption: MenuItem = {}
  if (reconcileActivity && reconcileActivity.length > 0) {
    reconcileOption = {
      icon: () => <Icon path={ mdiCheck } size={ 1 }/>,
      label: i10n('page.accounts.reconcile.active'),
      command: () => reconcileOverviewRef.current.open()
    }
  } else if (reconcileActivity) {
    reconcileOption = {
      icon: () => <Icon path={ mdiBagChecked } size={ 1 }/>,
      label: i10n('page.reports.default.reconcile'),
      command: () => reconcileStartRef.current.open()
    }
  }

  const menuOptions = [
    {
      icon: () => <Icon path={ mdiSquareEditOutline } size={ 1 }/>,
      label: i10n('common.action.edit'),
      command() {
        navigate(`/accounts/own/${ account.id }/edit`)
      }
    },
    {
      icon: () => <Icon path={ mdiTrashCanOutline } size={ 1 }/>,
      label: i10n('common.action.delete'),
      className: '[&>div>a]:!text-red-600 [&>div>a>.p-menuitem-text]:!text-red-600',
      command() {
        confirmDialog({
          message: i10n('page.accounts.delete.confirm'),
          header: i10n('common.action.delete'),
          defaultFocus: 'reject',
          acceptClassName: 'p-button-danger',
          accept: () => {
            AccountRepository.delete(account.id)
              .then(() => NotificationService.success('page.account.delete.success'))
              .then(() => callback())
              .catch(() => NotificationService.warning('page.account.delete.failed'))
          }
        });
      }
    },
    {
      separator: true
    },
    reconcileOption
  ] as MenuItem[]

  return <>
    <Menu popup popupAlignment='right' ref={ actionMenu } model={ menuOptions }/>
    <Button icon={ mdiDotsVertical }
            text
            onClick={ (event) => actionMenu?.current?.toggle(event) }
            aria-controls="popup_menu_right"
            aria-haspopup/>
    <ReconcileStartComponent account={ account }
                             ref={ reconcileStartRef }
                             afterCreate={ () => loadReconcileActivity(account.id, setReconcileActivity) }/>
    <ReconcileOverviewComponent accountId={ account.id }
                                ref={ reconcileOverviewRef }
                                onRemoved={ () => () => loadReconcileActivity(account.id, setReconcileActivity) }/>
  </>
}

export default OwnAccountMenu
