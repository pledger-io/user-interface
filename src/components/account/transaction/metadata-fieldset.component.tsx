import { i10n } from "../../../config/prime-locale";
import { Resolver } from "../../../core";
import React, { useEffect } from "react";
import { Transaction } from "../../../types/types";
import { Entity, Input } from "../../form";

export type SuggestionFunction = {
  suggest: (suggestion: Suggestion) => void;
}
export type Suggestion = {
  category?: string,
  budget?: string,
  contract?: string,
  tags?: string[],
}

const MetadataFieldsetComponent = ({ transaction, suggestionFunc }: {
  transaction: Transaction,
  suggestionFunc: SuggestionFunction
}) => {
  const [suggestion, setSuggestion] = React.useState<Suggestion>();

  useEffect(() => {
    if (suggestionFunc) {
      suggestionFunc.suggest = (suggestion: Suggestion) => setSuggestion(suggestion)
    }
  }, [suggestionFunc])

  const isNotTransfer = !Resolver.Transaction.isTransfer(transaction)
  const categoryValue = transaction.metadata?.category || suggestion?.category
  const budgetValue = transaction.metadata?.budget || suggestion?.budget
  const contractValue = transaction.metadata?.contract || suggestion?.contract
  const tags = transaction.metadata?.tags || suggestion?.tags?.map((tag: any) => tag.name).filter(tag => tag && tag.length > 0)
  return <fieldset className='mt-4'>
    <legend className='font-bold text-xl underline'>{ i10n('page.transaction.add.link') }</legend>
    <Entity.Category id='category'
                     value={ categoryValue }
                     title='Transaction.category'/>

    { isNotTransfer && <Entity.Budget id='budget'
                                      value={ budgetValue }
                                      title='Transaction.budget'/> }

    { isNotTransfer && <Entity.Contract id='contract'
                                        value={ contractValue }
                                        title='Transaction.contract'/> }

    <Input.Tags title='Transaction.tags'
                value={ tags }
                id='tags'/>
  </fieldset>
}

export default MetadataFieldsetComponent
