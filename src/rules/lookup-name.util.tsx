import { Account, BudgetExpense, Category, Contract, Identifier, RuleField } from "../core/types";
import AccountRepository from "../core/repositories/account-repository";
import CategoryRepository from "../core/repositories/category-repository";
import ContractRepository from "../core/repositories/contract-repository";
import { useEffect, useState } from "react";
import BudgetRepository from "../core/repositories/budget.repository";

async function lookup_entity<T>(type: RuleField, id: Identifier) : Promise<T> {
    switch (type) {
        case 'SOURCE_ACCOUNT':
        case 'TO_ACCOUNT':
        case 'CHANGE_TRANSFER_TO':
        case 'CHANGE_TRANSFER_FROM':
            return await AccountRepository.get(id)
        case 'CATEGORY':
            // @ts-ignore
            return await CategoryRepository.get(id)
        case 'BUDGET':
            return (await BudgetRepository.budgetMonth(new Date().getFullYear(), new Date().getMonth() + 1))
                .expenses.filter((e : BudgetExpense) => e.id === id)[0] as T
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
            return (await lookup_entity<Category>(type, id)).label
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
    EntityNameComponent
}