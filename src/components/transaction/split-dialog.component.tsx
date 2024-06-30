import React, { CSSProperties } from "react";

import { mdiTable } from "@mdi/js";
import { Transaction } from "../../core/types";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";
import { Dialog } from "../layout/popup";
import Translation from "../localization/translation.component";

const priceStyle = {
    textAlign: 'right'
} as CSSProperties
const totalRowStyle = {
    border: 0
}
const totalStyle = {
    ...totalRowStyle,
    textAlign: 'right',
    fontWeight: 600
} as CSSProperties

type TransactionSplitDialogProps = {
    transaction: Transaction
    iconStyle?: boolean
}

const TransactionSplitDialog = ({ transaction: { split, currency, amount }, iconStyle = false }: TransactionSplitDialogProps) => {

    return (
        <Dialog title='page.transactions.detail.title'
                openButton={ <Button label='page.transaction.action.details'
                                     variant={ iconStyle ? 'icon' : 'primary' }
                                     icon={ mdiTable }/> }>
            <table className='Table'>
                <thead>
                <tr>
                    <th><Translation label='Transaction.description'/></th>
                    <th><Translation label='Transaction.amount'/></th>
                </tr>
                </thead>
                <tbody>
                { split.map((row: any, idx: number) => (
                    <tr key={ idx }>
                        <td>{ row.description }</td>
                        <td style={ priceStyle }><MoneyComponent money={ row.amount } currency={ currency }/></td>
                    </tr>
                )) }
                <tr>
                    <td style={ totalStyle }>Total:</td>
                    <td style={ totalRowStyle }><MoneyComponent money={ amount } currency={ currency }/></td>
                </tr>
                </tbody>
            </table>
        </Dialog>
    )
}

export default TransactionSplitDialog
