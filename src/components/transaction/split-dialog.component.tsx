import React, { FC, Ref, useImperativeHandle, useState } from "react";
import { DialogOptions, Transaction } from "../../types/types";
import MoneyComponent from "../format/money.component";
import { Dialog } from "primereact/dialog";
import { i10n } from "../../config/prime-locale";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type TransactionSplitDialogProps = {
  transaction: Transaction
  ref: Ref<DialogOptions>
}

const TransactionSplitDialog: FC<TransactionSplitDialogProps> = ({ ref, transaction: { split, currency, amount } }) => {
  const [visible, setVisible] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const footer = () => <>
    <span className='flex justify-end gap-3'>Total: <MoneyComponent money={ amount } currency={ currency }/></span>
  </>

  return (
    <Dialog header={ i10n('page.transactions.detail.title') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <DataTable value={ split } size='small' footer={ footer } >
        <Column field='description' header={ i10n('Transaction.description') }/>
        <Column header={ i10n('Transaction.amount') }
                body={ item => <MoneyComponent money={ item.amount } currency={ currency }/> }/>
      </DataTable>
    </Dialog>
  )
}

export default TransactionSplitDialog
