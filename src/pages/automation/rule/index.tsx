import { mdiArrowDown, mdiArrowUp, mdiDelete, mdiPlus } from "@mdi/js";
import React, { useEffect } from "react";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Confirm from "../../../components/layout/popup/confirm.component";
import RuleRepository from "../../../core/repositories/rule-repository";
import { RuleGroup } from "../../../types/types";
import GroupAddDialog from "../../../components/transaction/rule/group-add.dialog";
import RuleListComponent from "../../../components/transaction/rule/rule-list.component";
import NotificationService from "../../../service/notification.service";


const _ = () => {
    const [groups, setGroups] = React.useState<RuleGroup[]>([])

    const loadGroups = () => RuleRepository.groups()
        .then(setGroups)

    useEffect(() => {
        loadGroups()
    }, []);

    const onGroupUp = (group: RuleGroup) => RuleRepository.groupUp(group.name)
        .then(loadGroups)
        .catch(() => NotificationService.warning('page.settings.rules.group.up.error'))

    const onGroupDown = (group: RuleGroup) => RuleRepository.groupDown(group.name)
        .then(loadGroups)
        .catch(() => NotificationService.warning('page.settings.rules.group.down.error'))

    const onDelete = (group: RuleGroup) => RuleRepository.deleteGroup(group.name)
        .then(loadGroups)
        .catch(() => NotificationService.warning('page.settings.rules.group.delete.error'))

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.accounting'/>
            <BreadCrumbItem label='page.nav.automation'/>
            <BreadCrumbItem label='page.nav.settings.rules'/>
        </BreadCrumbs>

        <GroupAddDialog onAdd={ () => RuleRepository.groups().then(setGroups) }/>

        { groups?.map((group, idx) =>
            <Card message={ group.name }
                  key={ group.name }
                  actions={ [
                      <div className='flex gap-1' key='buttons'>
                          { idx > 0 && <Button icon={ mdiArrowUp }
                                               variantType='outline'
                                               variant='info'
                                               onClick={ () => onGroupUp(group) }/> }
                          { (idx + 1) < groups.length && <Button icon={ mdiArrowDown }
                                                                 variantType='outline'
                                                                 variant='info'
                                                                 onClick={ () => onGroupDown(group) }/> }

                          <Confirm title='page.settings.rules.group.delete.confirm.title'
                                   openButton={
                                       <Button icon={ mdiDelete }
                                               onClick={ () => onDelete(group) }
                                               variant='warning'/>
                                   }
                                   onConfirm={ () => onDelete(group) }/>
                          <Button label='page.settings.rules.add'
                                  href={ `/automation/schedule/rules/${ group.name }/create` }
                                  icon={ mdiPlus }/>
                      </div>
                  ] }>
                <RuleListComponent group={ group.name }/>
            </Card>
        ) }
    </>
}

export default _