import React from "react";
import { Transaction } from "../../../types/types";
import { Entity } from "../../form";

const DestinationInputComponent = ({ transaction: { destination, type } }: { transaction: Transaction }) => {
    if (type?.code?.toLowerCase() === 'credit') {
        return <Entity.Account id='to'
                               type='creditor'
                               value={ destination }
                               required
                               title='Transaction.to'/>
    }

    return <Entity.ManagedAccount id='to'
                                  value={ destination }
                                  required
                                  title='Transaction.to'/>
}

export default DestinationInputComponent