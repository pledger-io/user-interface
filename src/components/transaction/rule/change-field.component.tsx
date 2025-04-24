import { mdiDelete } from "@mdi/js";
import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";
import React, { useEffect, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import { Account, BudgetExpense, Category, Contract, RuleChange } from "../../../types/types";
import { Entity, Input } from "../../form";
import { Button } from "../../layout/button";
import Loading from "../../layout/loading.component";
import { lookup_entity } from "../../lookup-name.util";

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

  const selectOptions: SelectItem[] = [
    { label: i10n('TransactionRule.Column.SOURCE_ACCOUNT'), value: 'SOURCE_ACCOUNT' },
    { label: i10n('TransactionRule.Column.TO_ACCOUNT'), value: 'TO_ACCOUNT' },
    { label: i10n('TransactionRule.Column.CATEGORY'), value: 'CATEGORY' },
    { label: i10n('TransactionRule.Column.CHANGE_TRANSFER_TO'), value: 'CHANGE_TRANSFER_TO' },
    { label: i10n('TransactionRule.Column.CHANGE_TRANSFER_FROM'), value: 'CHANGE_TRANSFER_FROM' },
    { label: i10n('TransactionRule.Column.BUDGET'), value: 'BUDGET' },
    { label: i10n('TransactionRule.Column.CONTRACT'), value: 'CONTRACT' },
    { label: i10n('TransactionRule.Column.TAGS'), value: 'TAGS' },
  ]

  return <>
    <div className='flex gap-1 mb-2 items-center my-2'>
      <Dropdown id={ `chang_${ change.uuid }_field` }
                options={ selectOptions }
                value={ change.field }
                className='w-[15rem]'
                onChange={ event => onValueChange(change.uuid, 'field', event.value)} />

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
        && <Entity.Category value={ entity }
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
                               type='button'
                               text
                               onClick={ () => onChangeDelete(change) }
                               severity='danger'/> }
    </div>
  </>
}

export default ChangeFieldComponent
