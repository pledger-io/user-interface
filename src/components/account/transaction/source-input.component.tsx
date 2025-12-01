import React from "react";
import { Transaction } from "../../../types/types";
import { Entity } from "../../form";

type SourceInputComponentProps = {
  transaction: Transaction,
  className?: string
}

const SourceInputComponent = ({ transaction: { source, type }, className }: SourceInputComponentProps) => {
  if (type.toLowerCase() === 'debit') {
    return <Entity.Account id='from'
                           type='debtor'
                           className={ className }
                           value={ source }
                           required
                           title='Transaction.source'/>
  }

  return <Entity.ManagedAccount id='from'
                                className={ className }
                                value={ source }
                                required
                                title='Transaction.source'/>
}

export default SourceInputComponent
