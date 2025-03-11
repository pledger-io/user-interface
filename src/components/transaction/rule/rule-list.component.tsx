import { mdiCheck, mdiClose, mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../../config/prime-locale";
import RuleRepository from "../../../core/repositories/rule-repository";
import NotificationService from "../../../service/notification.service";
import { Identifier, Rule, RuleChange, RuleCondition } from "../../../types/types";
import { Button } from "../../layout/button";
import { EntityNameComponent } from "../../lookup-name.util";

const checkMarkIcon = (checked: boolean) => {
  if (checked) return <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto'/>
  return <Icon path={ mdiClose } size={ 1 } className='text-warning mx-auto'/>
}

const conditionList = (conditions: RuleCondition[]) => {
  return conditions.map(condition => <div key={ condition.id } className='flex gap-1'>
    <div>{ i10n(`TransactionRule.Column.${ condition.field }`) }</div>
    <div>{ i10n(`TransactionRule.Operation.${ condition.operation }`) }</div>
    <div className='text-green-600'>{ condition.condition }</div>
  </div>)
}

const changeList = (changes: RuleChange[]) => {
  return changes.map(change => <div key={ change.id } className='flex gap-1'>
    <div className='text-muted'>{ i10n('TransactionRule.Change') }</div>
    <div className='text-blue-800'>{ i10n(`TransactionRule.Column.${ change.field }`) }</div>
    <div className='text-muted'>{ i10n('TransactionRule.To') }</div>
    <span className='text-green-700'>
        <EntityNameComponent type={ change.field } id={ change.change }/>
      </span>
  </div>)
}

const RuleActionMenu: FC<{ group: string, rule: Rule, callback: (_: Identifier) => void }> = ({ group, rule, callback }) => {
  const actionMenu = useRef<Menu>(null);
  const navigate = useNavigate();

  const menuOptions = [
    {
      icon: () => <Icon path={ mdiSquareEditOutline } size={ 1 }/>,
      label: i10n('common.action.edit'),
      command() {
        navigate(`/automation/schedule/rules/${ group }/${ rule.id }/edit`)
      }
    },
    {
      icon: () => <Icon path={ mdiTrashCanOutline } size={ 1 }/>,
      label: i10n('common.action.delete'),
      className: '[&>div>a]:!text-red-600 [&>div>a>.p-menuitem-text]:!text-red-600',
      command() {
        confirmDialog({
          message: i10n('page.settings.rules.delete.confirm'),
          header: i10n('common.action.delete'),
          defaultFocus: 'reject',
          acceptClassName: 'p-button-danger',
          accept: () => {
            RuleRepository.deleteRule(group, rule.id)
              .then(() => callback(rule.id))
              .then(() => NotificationService.success('page.settings.rules.delete.success'))
              .catch(() => NotificationService.warning('page.settings.rules.delete.error'))
          }
        });
      }
    }
  ] as MenuItem[]

  return <>
    <Menu popup popupAlignment='right' ref={ actionMenu } model={ menuOptions }/>

    <Button icon={ mdiDotsVertical }
            text
            className='!border-none'
            onClick={ (event) => actionMenu?.current?.toggle(event) }
            aria-controls="popup_menu_right" aria-haspopup/>
  </>
}

const RuleListComponent = ({ group }: { group: string }) => {
  const [rules, setRules] = useState<Rule[]>()

  useEffect(() => {
    RuleRepository.rules(group)
      .then(rules => setRules(rules.sort((a, b) => a.sort - b.sort)))
  }, [group])

  return <DataTable value={ rules } loading={ !rules }>
    <Column field='name' header={ i10n('TransactionRule.name') }/>
    <Column body={ rule => conditionList(rule.conditions) } header={ i10n('TransactionRule.conditions') }/>
    <Column body={ rule => changeList(rule.changes) } header={ i10n('TransactionRule.changes') }/>
    <Column header={ i10n('TransactionRule.restrictive') }
            bodyClassName='w-[2rem]'
            body={ rule => checkMarkIcon(rule.restrictive) }/>
    <Column header={ i10n('TransactionRule.active') }
            bodyClassName='w-[2rem]'
            body={ rule => checkMarkIcon(rule.active) }/>
    <Column body={ rule => <RuleActionMenu rule={ rule } callback={ (id) => setRules(rules?.filter(rule => rule.id !== id)) } group={ group }/> }
            bodyClassName='w-[2rem]'/>
  </DataTable>
}

export default RuleListComponent
