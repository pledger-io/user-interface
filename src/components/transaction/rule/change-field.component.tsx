import { Account, BudgetExpense, Category, Contract, RuleChange } from "../../../types/types";
import React, { useEffect, useState } from "react";
import Loading from "../../layout/loading.component";
import { lookup_entity } from "../../lookup-name.util";
import { Entity, Input } from "../../form";
import { mdiDelete } from "@mdi/js";
import { Button } from "../../layout/button";
import Translation from "../../localization/translation.component";

export type ChangeProperty = keyof RuleChange
export type ChangeValueHandler = (_uuid: string, _field: ChangeProperty, _value: string) => void

const ChangeFieldComponent = (props: {
    change: RuleChange,
    onChangeDelete: (_: RuleChange) => void,
    onValueChange: ChangeValueHandler
}) => {
    const { change, onChangeDelete, onValueChange } = props
    const [entity, setEntity] = useState<any>()

    useEffect(() => {
        if (change.change) {
            if (change.change !== entity?.id) {
                lookup_entity(change.field, change.change)
                    .then(setEntity)
                    .catch(_ => setEntity(null))
            }
        }
    }, [change.change, change.field])

    if (change.change && !entity) return <Loading />
    return <>
        <div className='flex gap-1 mb-2 items-start'>
            <select id={ `chang_${ change.uuid }_field` }
                    onChange={ (event) => onValueChange(change.uuid, 'field', event.currentTarget.value) }
                    defaultValue={ change.field }>
                <option value="SOURCE_ACCOUNT"><Translation label='TransactionRule.Column.SOURCE_ACCOUNT' noHtml={ true }/></option>
                <option value="TO_ACCOUNT"><Translation label='TransactionRule.Column.TO_ACCOUNT' noHtml={ true }/></option>
                <option value="CATEGORY"><Translation label='TransactionRule.Column.CATEGORY' noHtml={ true }/></option>
                <option value="CHANGE_TRANSFER_TO"><Translation label='TransactionRule.Column.CHANGE_TRANSFER_TO' noHtml={ true }/></option>
                <option value="CHANGE_TRANSFER_FROM"><Translation label='TransactionRule.Column.CHANGE_TRANSFER_FROM' noHtml={ true }/></option>
                <option value="BUDGET"><Translation label='TransactionRule.Column.BUDGET' noHtml={ true }/></option>
                <option value="CONTRACT"><Translation label='TransactionRule.Column.CONTRACT' noHtml={ true }/></option>
                <option value="TAGS"><Translation label='TransactionRule.Column.TAGS' noHtml={ true }/></option>
            </select>

            { (change.field === 'CHANGE_TRANSFER_TO' || change.field === 'CHANGE_TRANSFER_FROM')
                && <Entity.ManagedAccount id={ `chang_${ change.uuid }_change` }
                                          onChange={ (value: Account) => onValueChange(change.uuid, 'change', value.id as string) }
                                          title='dd'
                                          value={ entity?.id }
                                          className='m-0! flex-1 [&>label]:hidden!'/> }

            { change.field === 'SOURCE_ACCOUNT'
                && <Entity.Account value={ entity }
                                   onChange={ (value: Account) => onValueChange(change.uuid, 'change', value.id as string) }
                                   id={ `chang_${ change.uuid }_change` }
                                   className='m-0! flex-1 [&>label]:hidden!'
                                   title='dd'
                                   inputOnly={ true }
                                   type='debtor'/> }

            { change.field === 'TO_ACCOUNT'
                && <Entity.Account value={ entity }
                                   onChange={ (value: Account) => onValueChange(change.uuid, 'change', value.id as string) }
                                   id={ `chang_${ change.uuid }_change` }
                                   className='m-0! flex-1 [&>label]:hidden!'
                                   title='dd'
                                   inputOnly={ true }
                                   type='creditor'/> }


            { change.field === 'CATEGORY'
                && <Entity.Category value={ { id: -1, name: entity?.label } }
                                    onChange={ (value: Category) => onValueChange(change.uuid, 'change', value.id as string) }
                                    id={ `chang_${ change.uuid }_change` }
                                    className='m-0! flex-1 [&>label]:hidden!'
                                    inputOnly={ true }
                                    title='dd'/> }

            { change.field === 'BUDGET'
                && <Entity.Budget value={ entity }
                                  onChange={ (value: BudgetExpense) => onValueChange(change.uuid, 'change', value.id as string) }
                                  id={ `chang_${ change.uuid }_change` }
                                  className='m-0! flex-1 [&>label]:hidden!'
                                  title='dd'/> }

            { change.field === 'CONTRACT'
                && <Entity.Contract value={ entity }
                                    onChange={ (value: Contract) => onValueChange(change.uuid, 'change', value.id as string) }
                                    id={ `chang_${ change.uuid }_change` }
                                    className='m-0! flex-1 [&>label]:hidden!'
                                    title='dd'/> }

            { change.field === 'TAGS'
                && <Input.Tags id={ `chang_${ change.uuid }_change` }
                               title='dd'
                               value={ entity }
                               className='m-0! flex-1 [&>label]:hidden!'
                               onChange={ (value: string[]) => onValueChange(change.uuid, 'change', value.join(",")) }/> }

            { change.uuid && <Button icon={ mdiDelete }
                                     onClick={ () => onChangeDelete(change) }
                                     variant='warning'/> }
        </div>
    </>
}

export default ChangeFieldComponent