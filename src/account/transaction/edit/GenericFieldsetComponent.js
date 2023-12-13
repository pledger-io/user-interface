import React, { useContext } from "react";
import { Translations } from "../../../core";
import { Input } from "../../../core/form";

import SourceInputComponent from "./source-input.component";
import DestinationInputComponent from "./DestinationInputComponent";
import SplitEditor from "./SplitEditor";
import { FormContext } from "../../../core/form/Form";

const GenericDetailsComponent = ({ transaction, account }) => {
    const formContext = useContext(FormContext)

    const onSplitTotalChanged = total => formContext.onChange(
        { currentTarget: { value: total }, persist: () => {} },
        formContext.fields['amount'])

    return <>
        <fieldset>
            <legend><Translations.Translation label='page.transaction.add.details'/></legend>

            <Input.Text id='description'
                        type='text'
                        value={transaction.description}
                        title='Transaction.description'
                        required/>

            <SourceInputComponent transaction={transaction}/>
            <DestinationInputComponent transaction={transaction}/>

            <Input.Amount id='amount'
                          value={transaction.amount}
                          title='Transaction.amount'
                          currency={transaction.currency || account.account?.currency}
                          readonly={transaction.split !== undefined}
                          required/>

            {transaction.split && <SplitEditor transaction={transaction} totalChanged={onSplitTotalChanged} />}

            <Input.Date id='date'
                        value={transaction.dates?.transaction}
                        title='Transaction.date'
                        required />
        </fieldset>
    </>
}

export default GenericDetailsComponent