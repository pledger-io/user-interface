import {BreadCrumbItem, BreadCrumbs, Buttons, Layout, Notifications} from "../../core";
import React, {useEffect} from "react";
import {mdiArrowDown, mdiArrowUp, mdiDelete, mdiPlus} from "@mdi/js";
import RuleRepository from "../../core/repositories/rule-repository";
import {RuleGroup} from "../../core/types";
import RuleListComponent from "./rule-list.component";
import GroupAddDialog from "./group-add.dialog";
import {ConfirmPopup} from "../../core/popups";


const RulesOverview = () => {
    const [groups, setGroups] = React.useState<RuleGroup[]>([])

    const loadGroups = () => RuleRepository.groups()
        .then(setGroups)

    useEffect(() => {
        loadGroups()
    }, []);

    const onGroupUp = (group: RuleGroup) => RuleRepository.groupUp(group.name)
        .then(loadGroups)
        .catch(() => Notifications.Service.warning('page.settings.rules.group.up.error'))

    const onGroupDown = (group: RuleGroup) => RuleRepository.groupDown(group.name)
        .then(loadGroups)
        .catch(() => Notifications.Service.warning('page.settings.rules.group.down.error'))

    const onDelete = (group: RuleGroup) => RuleRepository.deleteGroup(group.name)
        .then(loadGroups)
        .catch(() => Notifications.Service.warning('page.settings.rules.group.delete.error'))

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.accounting'/>
            <BreadCrumbItem label='page.nav.automation'/>
            <BreadCrumbItem label='page.nav.settings.rules'/>
        </BreadCrumbs>

        <GroupAddDialog onAdd={ () => RuleRepository.groups().then(setGroups) } />

        { groups && groups.map((group, idx) =>
            <Layout.Card message={ group.name }
                         key={ group.name }
                         actions={ [
                             <div className='flex gap-1' key='buttons'>
                                 { idx > 0 && <Buttons.Button icon={ mdiArrowUp }
                                                              variantType='outline'
                                                              variant='info'
                                                              onClick={ () => onGroupUp(group) } /> }
                                 { (idx + 1)< groups.length && <Buttons.Button icon={ mdiArrowDown }
                                                                               variantType='outline'
                                                                               variant='info'
                                                                               onClick={ () => onGroupDown(group) } /> }

                                 <ConfirmPopup title='page.settings.rules.group.delete.confirm.title'
                                               openButton={
                                                   <Buttons.Button icon={ mdiDelete }
                                                                   onClick={ () => onDelete(group) }
                                                                   variant='warning' />
                                               }
                                               onConfirm={ () => onDelete(group) } />
                                 <Buttons.Button label='page.settings.rules.add'
                                                 href={ `/automation/schedule/rules/${group.name}/create` }
                                                 icon={ mdiPlus } />
                             </div>
                         ] }>
                <RuleListComponent group={ group.name } />
            </Layout.Card>
        ) }
    </>
}

export default RulesOverview