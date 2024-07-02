import React, { useContext } from "react";
import { Account, Transaction } from "../../../core/types";
import { Input } from "../../form";
import { FormContext } from "../../form/Form";
import Translation from "../../localization/translation.component";
import DestinationInputComponent from "./destination-field.component";

import SourceInputComponent from "./source-input.component";
import SplitEditor from "./split-editor.component";

type GenericDetailsComponentProps = {
    transaction: Transaction,
    account: Account
}

const GenericDetailsComponent = ({ transaction, account }: GenericDetailsComponentProps) => {
    const formContext = useContext(FormContext)

    const onSplitTotalChanged = (total: number) => formContext.onChange({
            currentTarget: { value: total }, persist: () => {}
        } as any,
        formContext.fields['amount'])

    return <>
        <fieldset>
            <legend><Translation label='page.transaction.add.details'/></legend>

            <Input.Text id='description'
                        type='text'
                        value={ transaction.description }
                        title='Transaction.description'
                        required/>

            <SourceInputComponent transaction={ transaction }/>
            <DestinationInputComponent transaction={ transaction }/>

            <Input.Amount id='amount'
                          value={ transaction.amount }
                          title='Transaction.amount'
                          currency={ transaction.currency || account.account?.currency }
                          readonly={ transaction.split !== undefined }
                          required/>

            { transaction.split && <SplitEditor transaction={ transaction } totalChanged={ onSplitTotalChanged }/> }

            <Input.Date id='date'
                        value={ transaction.dates?.transaction }
                        title='Transaction.date'
                        required/>
        </fieldset>
    </>
}

export default GenericDetailsComponent