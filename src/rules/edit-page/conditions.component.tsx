import { RuleCondition, RuleField, RuleOperator } from "../../core/types";
import { useInputField } from "../../core/form/input/InputGroup";
import { Buttons, Resolver, Translations } from "../../core";
import { mdiDelete, mdiPlusBox } from "@mdi/js";
import React from "react";

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

        onChange({ persist: () => {}, currentTarget: { value: updatedValue } })
    }

    const onDeleteCondition = (uuid: string) => {
        const updatedValue = field.value.filter((c: RuleCondition) => c.uuid !== uuid)
        onChange({ persist: () => {}, currentTarget: { value: updatedValue } })
    }

    const onConditionChange = (uuid: string, value: string) => {
        const updatedValue = field.value.map((c: RuleCondition) => {
            if (c.uuid === uuid) return { ...c, condition: value }
            return c
        })
        onChange({ persist: () => {}, currentTarget: { value: updatedValue } })
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
        onChange({ persist: () => {}, currentTarget: { value: updatedValue } })
    }

    if (!field) return <></>
    return <>
        { field.value.map((condition: RuleCondition) =>
            <div className='flex gap-1 mb-2 items-start' key={ condition.uuid }>
                <select defaultValue={ lookupCondition(condition) }
                        onChange={ (event) => onFieldChange(condition.uuid, event.currentTarget.value) }
                        id={ `cond[${condition.uuid}].field` }>
                    { PossibleConditions.map(possible =>
                        <option value={ possible.value } key={ possible.value }>
                            <Translations.Translation label={ `TransactionRule.Condition.${possible.value}` } />
                        </option>
                    ) }
                </select>
                <input type='text'
                       onChange={ (event) => onConditionChange(condition.uuid, event.currentTarget.value) }
                       defaultValue={ condition.condition }
                       id={ `cond[${condition.uuid}].cond` }
                       className='flex-1'/>
                { condition.uuid && <Buttons.Button icon={ mdiDelete }
                                                    onClick={ () => onDeleteCondition(condition.uuid || '') }
                                                    variant='warning'/> }
            </div>
        ) }

        <Buttons.Button label='page.settings.rules.condition.add'
                        variant='secondary'
                        onClick={ onAddCondition }
                        icon={ mdiPlusBox } />
    </>
}

export default ConditionFieldComponent