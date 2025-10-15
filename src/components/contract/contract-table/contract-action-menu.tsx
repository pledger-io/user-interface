import {
  mdiCalendarCheck,
  mdiCalendarPlus,
  mdiDotsVertical,
  mdiDownload,
  mdiSquareEditOutline,
  mdiTrashCanOutline,
  mdiUpload
} from "@mdi/js";
import Icon from "@mdi/react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import ContractRepository from "../../../core/repositories/contract-repository";
import { AttachmentRepository } from "../../../core/RestAPI";
import { Contract, DialogOptions } from "../../../types/types";
import { confirmDeleteDialog } from "../../confirm-dialog";
import { downloadBlob } from "../../download-blob";
import { Button } from "../../layout/button";
import ScheduleContract from "../schedule-dialog.component";
import UploadContract from "../upload-dialog.component";

const ContractMenuActions = ({ contract, callback }: { contract : Contract, callback: () => void }) => {
  const actionMenu = useRef<Menu>(null);
  const uploadContractRef = useRef<DialogOptions>(null);
  const scheduleContractRef = useRef<DialogOptions>(null);
  const navigate = useNavigate();
  const { success, warning } = useNotification();

  const menuOptions: MenuItem[] = []

  if (contract.fileToken) {
    menuOptions.push({
      label: i10n('page.budget.contracts.action.downloadContract'),
      icon: () => <Icon path={ mdiDownload } size={ 1 } />,
      command() {
        AttachmentRepository.download(contract.fileToken)
          .then(data => downloadBlob(data, `Contract-${contract.name}.pdf`))
      }
    })
  } else {
    menuOptions.push({
      label: i10n('page.budget.contracts.action.uploadContract'),
      icon: () => <Icon path={ mdiUpload } size={ 1 } />,
      command: () => uploadContractRef.current?.open()
    })
  }

  if (!contract.notification && !contract.terminated) {
    menuOptions.push({
      label: i10n('page.title.budget.contracts.warn'),
      icon: () => <Icon path={ mdiCalendarCheck } size={ 1 } />,
      command() {
        ContractRepository.warn(contract.id)
          .then(() => success('page.title.budget.contracts.warn.success'))
          .then(callback)
          .catch(() => warning('page.title.budget.contracts.warn.failed'))
      }
    })
  }

  if (!contract.terminated) {
    menuOptions.push({
      label: i10n('page.contract.action.schedule'),
      icon: () => <Icon path={ mdiCalendarPlus } size={ 1 } />,
      command: () => scheduleContractRef.current?.open()
    })
    if (menuOptions.length > 0) {
      menuOptions.push({
        separator: true
      })
    }
    menuOptions.push({
      icon: () => <Icon path={ mdiSquareEditOutline } size={ 1 }/>,
      label: i10n('common.action.edit'),
      command() {
        navigate(`./${ contract.id }/edit`)
      }
    })

    menuOptions.push({
      icon: () => <Icon path={ mdiTrashCanOutline } size={ 1 }/>,
      className: '[&>div>a]:!text-red-600 [&>div>a>.p-menuitem-text]:!text-red-600',
      label: i10n('common.action.delete'),
      command() {
        confirmDeleteDialog({
          message: i10n('page.budget.contracts.delete.confirm'),
          accept: () => {
            ContractRepository.delete(contract.id)
              .then(() => success('page.budget.contracts.delete.success'))
              .then(callback)
              .catch(() => warning('page.budget.contracts.delete.failed'))
          }
        })
      }
    })
  }

  return <>
    <Menu popup popupAlignment='right' ref={ actionMenu } model={ menuOptions } className='min-w-[17em]'/>
    <UploadContract id={ contract.id } onChanges={ callback } ref={ uploadContractRef }/>
    <ScheduleContract contract={ contract } ref={ scheduleContractRef } />
    <Button icon={ mdiDotsVertical }
            text
            className='!border-none'
            onClick={ (event) => actionMenu?.current?.toggle(event) }
            aria-controls="popup_menu_right" aria-haspopup/>
  </>
}

export default ContractMenuActions
