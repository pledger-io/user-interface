import React, { use } from "react";
import { i10n } from "../../../config/prime-locale";
import { Account, Transaction } from "../../../types/types";
import { Input } from "../../form";
import { FormContext } from "../../form/Form";
import DestinationInputComponent from "./destination-field.component";

import SourceInputComponent from "./source-input.component";
import SplitEditor from "./split-editor.component";

type GenericDetailsComponentProps = {
  transaction: Transaction,
  account: Account
}

const GenericDetailsComponent = ({ transaction, account }: GenericDetailsComponentProps) => {
  const formContext = use(FormContext)

  const onSplitTotalChanged = (total: number) => formContext.onChange({
      currentTarget: { value: total }, persist: () => {
      }
    } as any,
    formContext.fields['amount'])

  return <fieldset>
    <legend className='font-bold text-xl underline'>{ i10n('page.transaction.add.details') }</legend>

    <Input.Text id='description'
                type='text'
                value={ transaction.description }
                title='Transaction.description'
                required/>

    <div className='md:flex gap-4'>
      <SourceInputComponent transaction={ transaction } className='flex-1'/>
      <DestinationInputComponent transaction={ transaction } className='flex-1'/>
    </div>

    <div className='md:flex gap-4'>
      <Input.Amount id='amount'
                    className='flex-1'
                    value={ transaction.amount }
                    title='Transaction.amount'
                    currency={ transaction.currency || account.account?.currency }
                    readonly={ transaction.split !== undefined }
                    required/>

      <Input.Date id='date'
                  className='flex-1'
                  value={ transaction.dates?.transaction }
                  title='Transaction.date'
                  required/>
    </div>

    { transaction.split && <SplitEditor transaction={ transaction } totalChanged={ onSplitTotalChanged }/> }
  </fieldset>
}

export default GenericDetailsComponent
