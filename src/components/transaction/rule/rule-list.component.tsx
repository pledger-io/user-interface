import { mdiCheck, mdiClose, mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import RuleRepository from "../../../core/repositories/rule-repository";
import { Rule } from "../../../types/types";
import { EntityNameComponent } from "../../lookup-name.util";
import NotificationService from "../../../service/notification.service";
import { Button } from "../../layout/button";

import Dropdown from "../../layout/dropdown/dropdown.component";
import Loading from "../../layout/loading.component";
import { Confirm } from "../../layout/popup";
import Translation from "../../localization/translation.component";


const RuleListComponent = ({ group }: { group: string }) => {
    const [rules, setRules] = useState<Rule[]>()

    useEffect(() => {
        RuleRepository.rules(group)
            .then(rules => setRules(rules.sort((a, b) => a.sort - b.sort)))
    }, [group])

    const dropDownActions = { close: () => undefined }
    const onDelete = (rule: Rule) => RuleRepository.deleteRule(group, rule.id)
        .then(() => setRules(rules?.filter(r => r.id !== rule.id)))
        .then(() => NotificationService.success('page.settings.rules.delete.success'))
        .catch(() => NotificationService.warning('page.settings.rules.delete.error'))

    if (!rules) return <Loading/>
    return <table className='Table'>
        <thead>
        <tr>
            <th><Translation label='TransactionRule.name'/></th>
            <th><Translation label='TransactionRule.conditions'/></th>
            <th><Translation label='TransactionRule.changes'/></th>
            <th className='w-[6em]'><Translation label='TransactionRule.restrictive'/></th>
            <th className='w-[6em]'><Translation label='TransactionRule.active'/></th>
            <th className='w-[20px]'/>
        </tr>
        </thead>

        <tbody>

        { rules.length === 0 && <tr>
            <td colSpan={ 6 } className='text-gray-500 text-center'>
                <Translation label='common.overview.noresults'/>
            </td>
        </tr> }

        { rules.map(rule =>
            <tr key={ rule.id }>
                <td>{ rule.name }</td>
                <td>
                    { rule.conditions.map(condition =>
                        <div key={ condition.id } className='flex gap-1'>
                            <div><Translation label={ `TransactionRule.Column.${ condition.field }` }/></div>
                            <div><Translation label={ `TransactionRule.Operation.${ condition.operation }` }/></div>
                            <div className='text-green-600'>{ condition.condition }</div>
                        </div>
                    ) }
                </td>
                <td>
                    { rule.changes.map(change =>
                        <div key={ change.id } className='flex gap-1'>
                            <Translation label='TransactionRule.Change' className='text-gray-500'/>
                            <Translation label={ `TransactionRule.Column.${ change.field }` }
                                         className='text-blue-800'/>
                            <Translation label='TransactionRule.To' className='text-gray-500'/>
                            <span className='text-green-700'><EntityNameComponent type={ change.field }
                                                                                  id={ change.change }/></span>
                        </div>
                    ) }
                </td>
                <td>
                    { rule.restrictive && <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto'/> }
                    { !rule.restrictive && <Icon path={ mdiClose } size={ 1 } className='text-warning mx-auto'/> }
                </td>
                <td>
                    { rule.active && <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto'/> }
                    { !rule.active && <Icon path={ mdiClose } size={ 1 } className='text-warning mx-auto'/> }
                </td>
                <td>
                    <Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                        <Button label='common.action.edit'
                                variant='primary'
                                variantType='outline'
                                icon={ mdiSquareEditOutline }
                                href={ `/automation/schedule/rules/${ group }/${ rule.id }/edit` }/>
                        <Confirm title='common.action.delete'
                                 openButton={ <Button label='common.action.delete'
                                                      variant='warning'
                                                      variantType='outline'
                                                      icon={ mdiTrashCanOutline }/> }
                                 onConfirm={ () => onDelete(rule) }>
                            <Translation label='page.settings.rules.delete.confirm'/>
                        </Confirm>
                    </Dropdown>
                </td>
            </tr>
        ) }

        </tbody>
    </table>
}

export default RuleListComponent