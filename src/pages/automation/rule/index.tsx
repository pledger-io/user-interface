import { mdiArrowDown, mdiArrowUp, mdiDelete, mdiPencilOutline, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Card } from "primereact/card";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import React, { FC, useEffect } from "react";
import { NavLink } from "react-router";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../../components/layout/button";
import GroupAddDialog from "../../../components/transaction/rule/group-add.dialog";
import RuleListComponent from "../../../components/transaction/rule/rule-list.component";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import RuleRepository from "../../../core/repositories/rule-repository";
import { DialogOptions, RuleGroup } from "../../../types/types";

const _ = () => {
  const [groups, setGroups] = React.useState<RuleGroup[]>([])
  const addGroupDialogRef = React.useRef<DialogOptions>(null)

  const loadGroups = () => {
    RuleRepository.groups()
      .then(groups => setGroups(groups.sort((a, b) => a.sort - b.sort)))
  }

  useEffect(loadGroups, []);

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.accounting'/>
      <BreadCrumbItem label='page.nav.automation'/>
      <BreadCrumbItem label='page.nav.settings.rules'/>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <Card className='my-4 mx-2'>
      <div className='flex justify-end'>
        <GroupAddDialog onAdd={ () => RuleRepository.groups().then(setGroups) } ref={ addGroupDialogRef }/>
        <Button label='page.settings.rules.group.add'
                severity='secondary'
                size='small'
                onClick={ () => addGroupDialogRef.current?.open() }
                icon={ mdiPlus }/>
      </div>

      <div className='flex flex-col justify-end gap-2'>
        {
          groups.map((group, idx) =>
            <RuleGroupComponent key={ group.name } group={ group } index={ idx } size={ groups.length }
                                callback={ loadGroups }/>)
        }
      </div>
    </Card>
  </>
}

const RuleGroupComponent: FC<{ group: RuleGroup, index: number, size: number, callback: () => void }> =
  ({ group, index, size, callback }) => {
    const editGroupDialogRef = React.useRef<DialogOptions>(null)
    const { warning } = useNotification()

    const onGroupUp = (group: RuleGroup) => RuleRepository.groupUp(group.name)
      .then(callback)
      .catch(() => warning('page.settings.rules.group.up.error'))

    const onGroupDown = (group: RuleGroup) => RuleRepository.groupDown(group.name)
      .then(callback)
      .catch(() => warning('page.settings.rules.group.down.error'))

    const onDelete = () => {
      confirmDialog({
        message: i10n('page.settings.rules.group.delete.confirm.title'),
        header: i10n('common.action.delete'),
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        accept: () => {
          RuleRepository.deleteGroup(group.name)
            .then(callback)
            .catch(() => warning('page.settings.rules.group.delete.error'))
        }
      });
    }

    return <div className='my-4'>
      <div className='flex my-4 justify-between items-center gap-2'>
        <h1 className='text-lg font-bold flex items-center gap-1'>
          { group.name }
          <span onClick={ () => editGroupDialogRef.current?.open() }>
          <Icon path={ mdiPencilOutline } size={ .75 }
                title={ i10n('common.action.edit') }
                className='cursor-pointer text-muted opacity-20 hover:opacity-70'/>
        </span>
        </h1>
        <div>
          <NavLink to={ `/automation/schedule/rules/${ group.name }/create` } className='p-button p-button-text'>
            <Icon path={ mdiPlus } size={ 1 }/>
            { i10n('page.settings.rules.add') }
          </NavLink>
          <Button icon={ mdiDelete }
                  label='common.action.delete'
                  text
                  onClick={ onDelete }
                  severity='danger'/>
          { index > 0 && <Button icon={ mdiArrowUp }
                                 text
                                 severity='info'
                                 onClick={ () => onGroupUp(group) }/> }
          { (index + 1) < size && <Button icon={ mdiArrowDown }
                                          text
                                          severity='info'
                                          onClick={ () => onGroupDown(group) }/> }
        </div>
      </div>

      <RuleListComponent group={ group.name }/>
    </div>
  }

export default _
