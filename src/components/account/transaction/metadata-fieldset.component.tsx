import { Resolver } from "../../../core";
import React from "react";
import { Transaction } from "../../../types/types";
import { Entity, Input } from "../../form";
import Translation from "../../localization/translation.component";

const MetadataFieldsetComponent = ({ transaction }: { transaction: Transaction }) => {

    const isNotTransfer = !Resolver.Transaction.isTransfer(transaction)
    return <fieldset>
        <legend><Translation label='page.transaction.add.link'/></legend>

        <Entity.Category id='category'
                         value={ transaction.metadata?.category }
                         title='Transaction.category'/>

        { isNotTransfer && <Entity.Budget id='budget'
                                          value={ transaction.metadata?.budget }
                                          title='Transaction.budget'/> }

        { isNotTransfer && <Entity.Contract id='contract'
                                            value={ transaction.metadata?.contract }
                                            title='Transaction.contract'/> }

        <Input.Tags title='Transaction.tags'
                    value={ transaction.metadata?.tags }
                    id='tags'/>
    </fieldset>
}

export default MetadataFieldsetComponent