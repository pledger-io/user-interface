import { mdiAlertCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { i10n } from "../config/prime-locale";

type ConfirmDeleteDialogProps = {
  accept: () => void,
  message: string,
}

export const confirmDeleteDialog = ({ accept, message }: ConfirmDeleteDialogProps) => {
  confirmDialog({
    message,
    header: i10n('common.action.delete'),
    icon: () => <Icon path={ mdiAlertCircleOutline } size={ 1 }/>,
    defaultFocus: 'reject',
    footer: x => {
      return <>
        <Button label={ i10n('common.action.cancel') } text severity='info'
                icon='pi pi-times-circle'
                onClick={ x.reject }/>
        <Button label={ i10n('common.action.delete') } severity='danger'
                data-testid='confirm-button'
                icon='pi pi-trash' onClick={ x.accept }/>
      </>
    },
    accept
  })
}
