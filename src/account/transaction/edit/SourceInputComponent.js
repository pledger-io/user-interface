import {Entity} from "../../../core/form";
import React from "react";

const SourceInputComponent = ({transaction: {source, type}}) => {
    if (type?.code?.toLowerCase() === 'debit') {
        return <Entity.Account id='from'
                               type='debtor'
                               value={source}
                               required
                               title='Transaction.source'/>
    }

    return <Entity.ManagedAccount id='from'
                                  value={source?.id}
                                  required
                                  title='Transaction.source'/>
}

export default SourceInputComponent