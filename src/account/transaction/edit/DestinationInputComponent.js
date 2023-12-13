import { Entity } from "../../../core/form";
import React from "react";

const DestinationInputComponent = ({ transaction: { destination, type } }) => {
    if (type?.code?.toLowerCase() === 'credit') {
        return <Entity.Account id='to'
                               type='creditor'
                               value={destination}
                               required
                               title='Transaction.to'/>
    }

    return <Entity.ManagedAccount id='to'
                                  value={destination}
                                  required
                                  title='Transaction.to'/>
}

export default DestinationInputComponent