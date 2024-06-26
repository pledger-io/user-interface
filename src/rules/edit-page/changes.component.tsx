import { useInputField } from "../../core/form/input/InputGroup";
import { RuleChange, RuleCondition } from "../../core/types";
import { Buttons, Resolver } from "../../core";
import ChangeFieldComponent, { ChangeProperty, ChangeValueHandler } from "./change-field.component";
import { mdiPlusBox } from "@mdi/js";
import React from "react";


const ChangesComponent = (props: any) => {
    const [field, _, onChange] = useInputField({ onChange: (_) => void 0, field: props })

    /**
     * Delete a change from the list of changes
     */
    const onChangeDelete = (change: RuleChange) => {
        onChange({
            persist: () => {},
            currentTarget: {
                value: field.value.filter((c: RuleChange) => c.uuid !== change.uuid)
            }
        })
    }

    /**
     * Add a new change to the list of changes
     */
    const onAddChange = () => {
        onChange({
            persist: () => {},
            currentTarget: {
                value: [...field.value, {
                    uuid: Resolver.uuid(),
                    field: 'SOURCE_ACCOUNT',
                    change: ''
                }]
            }
        })
    }

    const onValueChange: ChangeValueHandler = (uuid: string, property: ChangeProperty, value: string) => {
        onChange({
            persist: () => {},
            currentTarget: {
                value: field.value.map((c: RuleCondition) => {
                    return c.uuid === uuid
                        ? { ...c, [property]: `${value}` }
                        : c
                })
            }
        })
    }

    if (!field) return <></>
    return <>

        { field.value.map((change: RuleChange) =>
            <ChangeFieldComponent change={ change }
                                  onChangeDelete={ onChangeDelete }
                                  onValueChange={ onValueChange }
                                  key={ change.uuid } />) }

        <Buttons.Button label='page.settings.rules.change.add'
                        variant='secondary'
                        onClick={ onAddChange }
                        icon={ mdiPlusBox } />
    </>
}

export default ChangesComponent