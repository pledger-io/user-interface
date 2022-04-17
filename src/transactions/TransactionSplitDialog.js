import React from "react";

import {Buttons, Dialog, Formats, Translations} from "../core";
import {mdiTable} from "@mdi/js";
import {EntityShapes} from "../config";

export class TransactionSplitDialog extends React.Component {
    static propTypes = {
        transaction: EntityShapes.Transaction
    }

    render() {
        const {transaction} = this.props
        const priceStyle = {
            textAlign: 'right'
        }
        const totalRowStyle = {
            border: 0
        }
        const totalStyle = {
            ...totalRowStyle,
            textAlign: 'right',
            fontWeight: 600
        }
        const splitRows = transaction.split.map((split, idx) => (
            <tr key={idx}>
                <td>{split.description}</td>
                <td style={priceStyle}><Formats.Money money={split.amount} currency={transaction.currency}/></td>
            </tr>
        ))

        return (
            <Dialog.Dialog title='page.transactions.detail.title'
                           openButton={<Buttons.Button label='page.transaction.action.details'
                                                       variantType='outline'
                                                       icon={mdiTable}/>}>
                <table className='Table'>
                    <thead>
                    <tr>
                        <th><Translations.Translation label='Transaction.description'/></th>
                        <th><Translations.Translation label='Transaction.amount'/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {splitRows}
                    <tr>
                        <td style={totalStyle}>Total:</td>
                        <td style={totalRowStyle}><Formats.Money money={transaction.amount} currency={transaction.currency}/></td>
                    </tr>
                    </tbody>
                </table>
            </Dialog.Dialog>
        )
    }
}
