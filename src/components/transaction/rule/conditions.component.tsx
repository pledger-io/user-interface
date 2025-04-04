import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";
import { i10n } from "../../../config/prime-locale";
import { RuleCondition, RuleField, RuleOperator } from "../../../types/types";
import { useInputField } from "../../form/input/InputGroup";
import { Resolver } from "../../../core";
import { mdiDelete, mdiPlusBox } from "@mdi/js";
import React from "react";
import { Button } from "../../layout/button";

const PossibleConditions = [
  { field: "AMOUNT", operation: "LESS_THAN", value: "amountLessThan" },
  { field: "AMOUNT", operation: "MORE_THAN", value: "amountMoreThan" },
  { field: "SOURCE_ACCOUNT", operation: "EQUALS", value: "sourceAccountEquals" },
  { field: "SOURCE_ACCOUNT", operation: "STARTS_WITH", value: "sourceAccountStartsWith" },
  { field: "SOURCE_ACCOUNT", operation: "CONTAINS", value: "sourceAccountContains" },
  { field: "TO_ACCOUNT", operation: "EQUALS", value: "toAccountEquals" },
  { field: "TO_ACCOUNT", operation: "STARTS_WITH", value: "toAccountStartsWith" },
  { field: "TO_ACCOUNT", operation: "CONTAINS", value: "toAccountContains" },
  { field: "DESCRIPTION", operation: "EQUALS", value: "descriptionEquals" },
  { field: "DESCRIPTION", operation: "STARTS_WITH", value: "descriptionStartsWith" },
  { field: "DESCRIPTION", operation: "CONTAINS", value: "descriptionContains" },
  { field: "CATEGORY", operation: "EQUALS", value: "categoryEquals" },
] as ({
  field: RuleField
  operation: RuleOperator
  value: string
})[]

function lookupCondition(condition: RuleCondition) {
  return PossibleConditions
    .find(possible => possible.field === condition.field && possible.operation === condition.operation)
    ?.value
}

const ConditionFieldComponent = (props: any) => {
  const [field, _, onChange] = useInputField({ onChange: (_) => void 0, field: props })

  const onAddCondition = () => {
    const updatedValue = [...field.value, {
      uuid: Resolver.uuid(),
      field: 'AMOUNT',
      operation: 'LESS_THAN',
      condition: ''
    }]

    onChange({
      persist: () => { },
      currentTarget: { value: updatedValue }
    })
  }

  const onDeleteCondition = (uuid: string) => {
    const updatedValue = field.value.filter((c: RuleCondition) => c.uuid !== uuid)
    onChange({
      persist: () => {},
      currentTarget: { value: updatedValue }
    })
  }

  const onConditionChange = (uuid: string, value: string) => {
    const updatedValue = field.value.map((c: RuleCondition) => {
      if (c.uuid === uuid) return { ...c, condition: value }
      return c
    })
    onChange({
      persist: () => {},
      currentTarget: { value: updatedValue }
    })
  }

  const onFieldChange = (uuid: string, value: string) => {
    const condition = PossibleConditions.filter((c: any) => c.value === value)[0]
    const updatedValue = field.value.map((c: RuleCondition) => {
      if (c.uuid === uuid) return {
        ...c,
        field: condition.field,
        operation: condition.operation
      }
      return c
    })
    onChange({
      persist: () => {},
      currentTarget: { value: updatedValue }
    })
  }

  const operatorOptions: SelectItem[] = PossibleConditions.map(condition => ({
    label: i10n(`TransactionRule.Condition.${ condition.value }`),
    value: condition.value
  }))

  if (!field) return <></>
  return <>
    { field.value.map((condition: RuleCondition) =>
      <div className='flex gap-1 mb-2 items-start' key={ condition.uuid }>
        <Dropdown id={ `cond[${ condition.uuid }].field` }
                  options={ operatorOptions }
                  value={ lookupCondition(condition) }
                  className='w-[15rem]'
                  onChange={ event => onFieldChange(condition.uuid, event.value)} />
        <input type='text'
               onChange={ (event) => onConditionChange(condition.uuid, event.currentTarget.value) }
               defaultValue={ condition.condition }
               id={ `cond[${ condition.uuid }].cond` }
               className='flex-1 p-inputtext'/>
        { condition.uuid && <Button icon={ mdiDelete }
                                    text
                                    type='button'
                                    onClick={ () => onDeleteCondition(condition.uuid || '') }
                                    severity='danger'/> }
      </div>
    ) }

    <Button label='page.settings.rules.condition.add'
            type='button'
            severity='secondary'
            onClick={ onAddCondition }
            icon={ mdiPlusBox }/>
  </>
}

export default ConditionFieldComponent
