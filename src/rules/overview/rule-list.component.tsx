import React, { useEffect, useState } from "react";
import { Rule } from "../../core/types";
import RuleRepository from "../../core/repositories/rule-repository";
import { Buttons, Dialog, Layout, Notifications, Translations } from "../../core";
import { EntityNameComponent } from "../lookup-name.util";
import Icon from "@mdi/react";
import { mdiCheck, mdiClose, mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import { Dropdown } from "../../core/dropdown";


const RuleListComponent = ({ group } : { group: string }) => {
    const [rules, setRules] = useState<Rule[]>()

    useEffect(() => {
        RuleRepository.rules(group)
            .then(rules => setRules(rules.sort((a, b) => a.sort - b.sort)))
    }, [group])

    const dropDownActions = { close: () => undefined }
    const onDelete = (rule: Rule) => RuleRepository.deleteRule(group, rule.id)
            .then(() => setRules(rules?.filter(r => r.id !== rule.id)))
            .then(() => Notifications.Service.success('page.settings.rules.delete.success'))
            .catch(() => Notifications.Service.warning('page.settings.rules.delete.error'))

    if (!rules) return <Layout.Loading/>
    return <table className='Table'>
        <thead>
        <tr>
            <th><Translations.Translation label='TransactionRule.name' /></th>
            <th><Translations.Translation label='TransactionRule.conditions' /></th>
            <th><Translations.Translation label='TransactionRule.changes' /></th>
            <th className='w-[6em]'><Translations.Translation label='TransactionRule.restrictive' /></th>
            <th className='w-[6em]'><Translations.Translation label='TransactionRule.active' /></th>
            <th className='w-[20px]' />
        </tr>
        </thead>

        <tbody>

        { rules.length === 0 && <tr>
            <td colSpan={ 6 } className='text-gray-500 text-center'>
                <Translations.Translation label='common.overview.noresults' />
            </td>
        </tr> }

        { rules.map(rule =>
            <tr key={ rule.id }>
                <td>{ rule.name }</td>
                <td>
                    { rule.conditions.map(condition =>
                        <div key={ condition.id } className='flex gap-1'>
                            <div><Translations.Translation label={ `TransactionRule.Column.${ condition.field }` } /></div>
                            <div><Translations.Translation label={ `TransactionRule.Operation.${ condition.operation }` } /></div>
                            <div className='text-green-600'>{ condition.condition }</div>
                        </div>
                    ) }
                </td>
                <td>
                    { rule.changes.map(change =>
                        <div key={ change.id } className='flex gap-1'>
                            <Translations.Translation label='TransactionRule.Change' className='text-gray-500' />
                            <Translations.Translation label={ `TransactionRule.Column.${ change.field }` }
                                                      className='text-blue-800' />
                            <Translations.Translation label='TransactionRule.To' className='text-gray-500' />
                            <span className='text-green-700'><EntityNameComponent type={ change.field } id={ change.change } /></span>
                        </div>
                    ) }
                </td>
                <td>
                    { rule.restrictive && <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto' /> }
                    { !rule.restrictive && <Icon path={ mdiClose } size={ 1 } className='text-warning mx-auto' /> }
                </td>
                <td>
                    { rule.active && <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto' /> }
                    { !rule.active && <Icon path={ mdiClose } size={ 1 } className='text-warning mx-auto' /> }
                </td>
                <td>
                    <Dropdown  icon={ mdiDotsVertical } actions={ dropDownActions }>
                        <Buttons.Button label='common.action.edit'
                                        variant='primary'
                                        variantType='outline'
                                        icon={ mdiSquareEditOutline }
                                        href={ `/automation/schedule/rules/${ group }/${ rule.id }/edit` }/>
                        <Dialog.ConfirmPopup title='common.action.delete'
                                             openButton={<Buttons.Button label='common.action.delete'
                                                                         variant='warning'
                                                                         variantType='outline'
                                                                         icon={ mdiTrashCanOutline }/>}
                                             onConfirm={ () => onDelete(rule) }>
                            <Translations.Translation label='page.settings.rules.delete.confirm'/>
                        </Dialog.ConfirmPopup>
                    </Dropdown>
                </td>
            </tr>
        ) }

        </tbody>
    </table>
}

export default RuleListComponent