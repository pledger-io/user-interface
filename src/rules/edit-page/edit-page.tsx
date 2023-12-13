import { BreadCrumbItem, BreadCrumbs, Buttons, Layout, Message, Notifications, Translations } from "../../core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rule } from "../../core/types";
import { Form, Input, SubmitButton } from "../../core/form";
import RuleRepository from "../../core/repositories/rule-repository";
import ConditionFieldComponent from "./conditions.component";
import ChangesComponent from "./changes.component";
import { mdiCancel, mdiContentSave } from "@mdi/js";


const EditPage = () => {
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
                .catch(() => Notifications.Service.warning('page.settings.rules.create.failed'))
        } else {
            RuleRepository.updateRule(group || '', id, entity)
                .then(() => navigate(-1))
                .catch(() => Notifications.Service.warning('page.settings.rules.update.failed'))
        }
    }

    const loading = id !== undefined && rule === undefined
    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.accounting'/>
            <BreadCrumbItem label='page.nav.automation'/>
            <BreadCrumbItem label='page.nav.settings.rules' href='/automation/schedule/rules' />

            { id !== undefined && rule && <BreadCrumbItem message={ rule.name } /> }
            { id === undefined && <BreadCrumbItem label='page.settings.rules.add'/> }
        </BreadCrumbs>

        <Form entity='TransactionRule' onSubmit={ onSubmit }>
            <Layout.Card title='page.nav.settings.rules.edit'
                         buttons={[
                             <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                             <Buttons.BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>
                         ]}>
                <Message label='page.settings.rules.help' variant='info'/>

                { loading && <Layout.Loading /> }

                { !loading && <fieldset>
                    <legend><Translations.Translation label='page.settings.rules.generic'/></legend>

                    <Input.Text id='name'
                                type='text'
                                title='TransactionRule.name'
                                value={rule?.name}
                                required />
                    <Input.TextArea id='description'
                                    title='TransactionRule.description'
                                    value={rule?.description} />

                    <div className='flex gap-2 items-center mb-1 mt-5'>
                        <Input.Toggle id='restrictive'
                                      className='ml-[15vw]'
                                      value={rule?.restrictive} />
                        <Translations.Translation label='TransactionRule.restrictive.explain' />
                    </div>
                    <div className='flex gap-2 items-center'>
                        <Input.Toggle id='active'
                                      className='ml-[15vw]'
                                      value={rule?.active} />
                        <Translations.Translation label='TransactionRule.active.explain' />
                    </div>
                </fieldset> }

                <hr />

                { !loading && <fieldset>
                    <legend className='mb-2 pt-4'>
                        <Translations.Translation label='TransactionRule.conditions'/>
                    </legend>

                    <ConditionFieldComponent id='conditions' value={ rule?.conditions || [] } />
                </fieldset> }

                { !loading && <hr /> }

                { !loading && <fieldset>
                    <legend className='mb-2 pt-4'>
                        <Translations.Translation label='TransactionRule.changes'/>
                    </legend>

                    <ChangesComponent id='changes' value={ rule?.changes || [] } />
                </fieldset> }
            </Layout.Card>
        </Form>
    </>
}

export default EditPage