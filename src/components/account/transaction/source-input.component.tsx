import React from "react";
import { Transaction } from "../../../types/types";
import { Entity } from "../../form";

type SourceInputComponentProps = {
    transaction: Transaction
}

const SourceInputComponent = ({ transaction: { source, type } } : SourceInputComponentProps) => {
    if (type.code.toLowerCase() === 'debit') {
        return <Entity.Account id='from'
                               type='debtor'
                               value={ source }
                               required
                               title='Transaction.source'/>
    }

    return <Entity.ManagedAccount id='from'
                                  value={ source }
                                  required
                                  title='Transaction.source'/>
}

export default SourceInputComponent