import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../../components/form";
import { BackButton } from "../../../components/layout/button";
import Message from "../../../components/layout/message.component";
import Translation from "../../../components/localization/translation.component";
import ChangesComponent from "../../../components/transaction/rule/changes.component";
import ConditionFieldComponent from "../../../components/transaction/rule/conditions.component";
import { i10n } from "../../../config/prime-locale";
import RuleRepository from "../../../core/repositories/rule-repository";
import NotificationService from "../../../service/notification.service";
import { Rule } from "../../../types/types";

const RuleForm = () => {
  const { id, group } = useParams()
  const [rule, setRule] = useState<Rule>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id && group)
      RuleRepository.rule(group, id)
        .then(setRule)
  }, [id, group]);

  const onSubmit = (data: Rule) => {
    const entity = {
      name: data.name,
      description: data.description,
      restrictive: data.restrictive,
      active: data.active,
      conditions: data.conditions.map(c => ({ column: c.field, operation: c.operation, value: c.condition })),
      changes: data.changes.map(c => ({ column: c.field, value: c.change }))
    }

    if (id === undefined) {
      RuleRepository.createRule(group || '', entity)
        .then(() => navigate(-1))
        .catch(() => NotificationService.warning('page.settings.rules.create.failed'))
    } else {
      RuleRepository.updateRule(group || '', id, entity)
        .then(() => navigate(-1))
        .catch(() => NotificationService.warning('page.settings.rules.update.failed'))
    }
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.nav.settings.rules.edit') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.accounting'/>
      <BreadCrumbItem label='page.nav.automation'/>
      <BreadCrumbItem label='page.nav.settings.rules' href='/automation/schedule/rules'/>

      { id !== undefined && rule && <BreadCrumbItem message={ rule.name }/> }
      { id === undefined && <BreadCrumbItem label='page.settings.rules.add'/> }
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      <Form entity='TransactionRule' onSubmit={ onSubmit }>
        <Message label='page.settings.rules.help' variant='info'/>

        <fieldset>
          <legend className='font-bold text-xl underline'>{ i10n('page.settings.rules.generic') }</legend>

          <Input.Text id='name'
                      type='text'
                      title='TransactionRule.name'
                      value={ rule?.name }
                      required/>
          <Input.TextArea id='description'
                          title='TransactionRule.description'
                          value={ rule?.description }/>

          <div className='flex gap-2 items-center my-2 mx-4'>
            <Input.Toggle id='restrictive' value={ rule?.restrictive }/>
            <Translation label='TransactionRule.restrictive.explain'/>
          </div>
          <div className='flex gap-2 items-center mx-4'>
            <Input.Toggle id='active' value={ rule?.active }/>
            <Translation label='TransactionRule.active.explain'/>
          </div>
        </fieldset>

        <fieldset className='my-4'>
          <legend className='font-bold text-xl underline'>{ i10n('TransactionRule.conditions') }</legend>
          <ConditionFieldComponent id='conditions' value={ rule?.conditions || [] }/>
        </fieldset>

        <fieldset className='my-4'>
          <legend className='font-bold text-xl underline'>{ i10n('TransactionRule.changes') }</legend>
          <ChangesComponent id='changes' value={ rule?.changes || [] }/>
        </fieldset>

        <div className='flex justify-end gap-2 mt-2'>
          <BackButton label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </>
}

export default RuleForm
