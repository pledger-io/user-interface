import React from "react";

import {mdiTable} from "@mdi/js";

import {Buttons, Dialog, Formats, Translations} from "../core";
import {EntityShapes} from "../config";
import PropTypes from "prop-types";

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

const TransactionSplitDialog = ({transaction: {split, currency, amount}, iconStyle = false}) => {

    return (
        <Dialog.Dialog title='page.transactions.detail.title'
                       openButton={<Buttons.Button label='page.transaction.action.details'
                                                   variant={iconStyle ? 'icon' : 'primary'}
                                                   icon={mdiTable}/>}>
            <table className='Table'>
                <thead>
                <tr>
                    <th><Translations.Translation label='Transaction.description'/></th>
                    <th><Translations.Translation label='Transaction.amount'/></th>
                </tr>
                </thead>
                <tbody>
                {split.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row.description}</td>
                        <td style={priceStyle}><Formats.Money money={row.amount} currency={currency}/></td>
                    </tr>
                ))}
                <tr>
                    <td style={totalStyle}>Total:</td>
                    <td style={totalRowStyle}><Formats.Money money={amount} currency={currency}/></td>
                </tr>
                </tbody>
            </table>
        </Dialog.Dialog>
    )
}
TransactionSplitDialog.propTypes = {
    transaction: EntityShapes.Transaction,
    iconStyle: PropTypes.bool
}

export default TransactionSplitDialog
