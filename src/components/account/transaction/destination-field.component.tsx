import React, { FC } from "react";
import { Transaction } from "../../../types/types";
import { Entity } from "../../form";

type DestinationInputComponentProps = {
  transaction: Transaction,
  className?: string
}

const DestinationInputComponent: FC<DestinationInputComponentProps> = ({ transaction: { destination, type }, className }) => {
  if (type?.toLowerCase() === 'credit') {
    return <Entity.Account id='to'
                           type='creditor'
                           className={ className }
                           value={ destination }
                           required
                           title='Transaction.to'/>
  }

  return <Entity.ManagedAccount id='to'
                                className={ className }
                                value={ destination }
                                required
                                title='Transaction.to'/>
}

export default DestinationInputComponent
