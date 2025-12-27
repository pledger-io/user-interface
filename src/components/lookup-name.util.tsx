import { Account, BudgetExpense, Category, Contract, Identifier, RuleField } from "../types/types";
import AccountRepository from "../core/repositories/account-repository";
import CategoryRepository from "../core/repositories/category-repository";
import ContractRepository from "../core/repositories/contract-repository";
import { useEffect, useState } from "react";
import BudgetRepository from "../core/repositories/budget.repository";

function lookup_entity_by_name<T>(type: RuleField, name: string): Promise<T> {
  let promise: Promise<T>;

  switch (type) {
    case 'SOURCE_ACCOUNT':
    case 'TO_ACCOUNT':
    case 'CHANGE_TRANSFER_TO':
    case 'CHANGE_TRANSFER_FROM':
      promise = AccountRepository.search({ types: undefined, numberOfResults: 9999 })
        .then(response => response.content.filter((account: Account) => account.name === name))
        .then(accounts => accounts[0] as T);
      break;
    case 'CATEGORY':
      promise = CategoryRepository.list(1, name)
        .then(response => response.content.filter((category: Category) => category.name === name))
        .then(categories => categories[0] as T);
      break;
    case 'BUDGET':
      promise =  BudgetRepository.budgetMonth(new Date().getFullYear(), new Date().getMonth() + 1)
        .then(budget => (budget.expenses || []).filter((e : BudgetExpense) => e.name == name))
        .then(expenses => expenses[0] as T);
      break;
    case 'CONTRACT':
      return ContractRepository.list('ACTIVE')
        .then(contracts => contracts.map(contract => contract.name == name))
        .then(contracts => contracts[0] as T);
  }

  return promise;
}

async function lookup_entity<T>(type: RuleField, id: Identifier) : Promise<T> {
    switch (type) {
        case 'SOURCE_ACCOUNT':
        case 'TO_ACCOUNT':
        case 'CHANGE_TRANSFER_TO':
        case 'CHANGE_TRANSFER_FROM':
            return await AccountRepository.get(id)
        case 'CATEGORY':
            // @ts-expect-error type is incorrect
            return await CategoryRepository.get(id)
                .then((c: Category) => ({ ...c, name: c.name }))
        case 'BUDGET':
            return (await BudgetRepository.budgetMonth(new Date().getFullYear(), new Date().getMonth() + 1))
                .expenses.filter((e : BudgetExpense) => e.id == id)[0] as T
        case 'CONTRACT':
            return await ContractRepository.get(id) as T
        case 'TAGS': return (id as string).split(',') as T
        default: return '' as T
    }
}

async function lookup_name(type: RuleField, id: Identifier) : Promise<string> {
    switch (type) {
        case 'SOURCE_ACCOUNT':
        case 'TO_ACCOUNT':
        case 'CHANGE_TRANSFER_TO':
        case 'CHANGE_TRANSFER_FROM':
            return (await lookup_entity<Account>(type, id)).name
        case 'CATEGORY':
            return (await lookup_entity<Category>(type, id)).name
        case 'BUDGET':
            return (await lookup_entity<BudgetExpense>(type, id)).name
        case 'CONTRACT':
            return (await lookup_entity<Contract>(type, id)).name
        case 'TAGS': return id as string
        default: return ''
    }
}


function EntityNameComponent({ type, id }: { type: RuleField, id: Identifier }) {
    const [label, setLabel] = useState<string>('Loading...')

    useEffect(() => {
        lookup_name(type, id).then(setLabel)
    }, [type, id])

    return <>
        { label }
    </>
}

export {
    lookup_entity,
  lookup_entity_by_name,
    EntityNameComponent
}