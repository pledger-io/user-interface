import { i10n } from "../../../config/prime-locale";
import { Resolver } from "../../../core";
import React, { useEffect } from "react";
import { BudgetExpense, Category, Contract, RuleField, Transaction } from "../../../types/types";
import { Entity, Input } from "../../form";
import { lookup_entity_by_name } from "../../lookup-name.util";

export type SuggestionFunction = {
  suggest: (suggestion: Suggestion) => void;
}
export type Suggestion = {
  category?: string,
  budget?: string,
  contract?: string,
  tags?: string[],
}

type LocatedEntities = {
  category?: Category
  budget?: BudgetExpense
  contract?: Contract
  tags?: string[],
}

async function lookup_suggestion<T>(type: RuleField, name: string | undefined): Promise<T | undefined> {
  if (name && type) {
    return await lookup_entity_by_name(type, name);
  }

  return Promise.reject(undefined)
}

const MetadataFieldsetComponent = ({ transaction, suggestionFunc }: {
  transaction: Transaction,
  suggestionFunc: SuggestionFunction
}) => {
  const [suggestion, setSuggestion] = React.useState<LocatedEntities>();

  useEffect(() => {
    if (suggestionFunc) {
      suggestionFunc.suggest = async (suggestion: Suggestion) => {
        setSuggestion({
          tags: suggestion.tags,
          category: await lookup_suggestion<Category>('CATEGORY', suggestion?.category),
          budget: await lookup_suggestion('BUDGET', suggestion?.budget),
          contract: await lookup_suggestion('CONTRACT', suggestion?.contract),
        })
      }
    }
  }, [suggestionFunc])

  const isNotTransfer = !Resolver.Transaction.isTransfer(transaction)
  const categoryValue = transaction.metadata?.category || suggestion?.category
  const budgetValue = transaction.metadata?.budget || suggestion?.budget
  const contractValue = transaction.metadata?.contract || suggestion?.contract
  const tags = transaction.metadata?.tags || suggestion?.tags?.filter(tag => tag && tag.length > 0)
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
