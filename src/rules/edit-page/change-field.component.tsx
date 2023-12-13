import { Account, BudgetExpense, Category, Contract, RuleChange } from "../../core/types";
import React, { useEffect, useState } from "react";
import { lookup_entity } from "../lookup-name.util";
import { Buttons, Translations } from "../../core";
import { Entity, Input } from "../../core/form";
import { mdiDelete } from "@mdi/js";

export type ChangeProperty = keyof RuleChange
export type ChangeValueHandler = (_uuid: string, _field: ChangeProperty, _value: string) => void

const ChangeFieldComponent = (props: {change : RuleChange, onChangeDelete: (_:RuleChange) => void, onValueChange: ChangeValueHandler}) => {
    const { change, onChangeDelete, onValueChange } = props
    const [entity, setEntity] = useState<any>()

    useEffect(() => {
        if (change.change) {
            lookup_entity(change.field, change.change)
                .then(setEntity)
                .catch(() => setEntity(undefined))
        }
    }, [change])

    return <>
        <div className='flex gap-1 mb-2 items-start'>
            <select id={ `chang_${change.uuid}_field` }
                    onChange={ (event) => onValueChange(change.uuid, 'field', event.currentTarget.value) }
                    defaultValue={ change.field }>
                <option value="SOURCE_ACCOUNT"><Translations.Translation label='TransactionRule.Column.SOURCE_ACCOUNT' /></option>
                <option value="TO_ACCOUNT"><Translations.Translation label='TransactionRule.Column.TO_ACCOUNT' /></option>
                <option value="CATEGORY"><Translations.Translation label='TransactionRule.Column.CATEGORY' /></option>
                <option value="CHANGE_TRANSFER_TO"><Translations.Translation label='TransactionRule.Column.CHANGE_TRANSFER_TO' /></option>
                <option value="CHANGE_TRANSFER_FROM"><Translations.Translation label='TransactionRule.Column.CHANGE_TRANSFER_FROM' /></option>
                <option value="BUDGET"><Translations.Translation label='TransactionRule.Column.BUDGET' /></option>
                <option value="CONTRACT"><Translations.Translation label='TransactionRule.Column.CONTRACT' /></option>
                <option value="TAGS"><Translations.Translation label='TransactionRule.Column.TAGS' /></option>
            </select>

            { (change.field === 'CHANGE_TRANSFER_TO' || change.field === 'CHANGE_TRANSFER_FROM')
                && <Entity.ManagedAccount id={`chang_${change.uuid}_change`}
                                          onChange={ (value: Account) => onValueChange(change.uuid, 'change', value.id as string) }
                                          title='dd'
                                          value={ entity?.id }
                                          className='!m-0 flex-1 [&>label]:!hidden'/>}

            { change.field === 'SOURCE_ACCOUNT'
                && <Entity.Account value={ entity }
                                   onChange={ (value: Account) => onValueChange(change.uuid, 'change', value.id as string) }
                                   id={`chang_${change.uuid}_change`}
                                   className='!m-0 flex-1 [&>label]:!hidden'
                                   title='dd'
                                   type='DEBTOR' /> }

            { change.field === 'TO_ACCOUNT'
                && <Entity.Account value={ entity }
                                   onChange={ (value: Account) => onValueChange(change.uuid, 'change', value.id as string) }
                                   id={`chang_${change.uuid}_change`}
                                   className='!m-0 flex-1 [&>label]:!hidden'
                                   title='dd'
                                   type='CREDITOR' /> }


            { change.field === 'CATEGORY'
                && <Entity.Category value={ { name: entity?.label, id: entity?.id } }
                                    onChange={ (value: Category) => onValueChange(change.uuid, 'change', value.id as string) }
                                    id={ `chang_${change.uuid}_change` }
                                    className='!m-0 flex-1 [&>label]:!hidden'
                                    title='dd'/>}

            { change.field === 'BUDGET' && <Entity.Budget value={ entity }
                                                          onChange={ (value: BudgetExpense) => onValueChange(change.uuid, 'change', value.id as string) }
                                                          id={ `chang_${change.uuid}_change` }
                                                          className='!m-0 flex-1 [&>label]:!hidden'
                                                          title='dd' /> }

            { change.field === 'CONTRACT'
                && <Entity.Contract value={ entity }
                                    onChange={ (value: Contract) => onValueChange(change.uuid, 'change', value.id as string) }
                                    id={ `chang_${change.uuid}_change` }
                                    className='!m-0 flex-1 [&>label]:!hidden'
                                    title='dd' /> }

            { change.field === 'TAGS'
                && <Input.Tags id={ `chang_${change.uuid}_change` }
                               title='dd'
                               value={ entity }
                               className='!m-0 flex-1 [&>label]:!hidden'
                               onChange={ (value: string[]) => onValueChange(change.uuid, 'change', value.join(",")) }/>}

            { change.uuid && <Buttons.Button icon={ mdiDelete }
                                             onClick={ () => onChangeDelete(change) }
                                             variant='warning'/> }
        </div>
    </>
}

export default ChangeFieldComponent