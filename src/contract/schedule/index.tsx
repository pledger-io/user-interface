import { FC } from "react";
import { Buttons, Dialog, Notifications, Translations } from "../../core";
import { Entity, Form, Input, SubmitButton } from "../../core/form";
import { mdiCalendarPlus, mdiContentSave } from "@mdi/js";
import { Account, Contract } from "../../core/types";
import ContractRepository from "../../core/repositories/contract-repository";


type ScheduleContractProps = {
    contract: Contract
}

type ScheduleContractModel = {
    source: Account,
    from: Account,
    amount: number,
    periodicity: string,
    interval: number
}

const ScheduleContract: FC<ScheduleContractProps> = ({ contract }) => {
    const dialogControl = {
        open: () => {},
        close: () => {}
    }

    const onSubmit = (e: ScheduleContractModel) => {
        const contractModel = {
            from: e.from,
            amount: e.amount,
            schedule: {
                periodicity: e.periodicity,
                interval: e.interval
            }
        }

        ContractRepository.schedule(contract.id, contractModel)
            .then(() => Notifications.Service.success('page.contract.schedule.success'))
            .then(() => dialogControl.close())
            .catch(() => Notifications.Service.warning('page.contract.schedule.error'));
    }

    return <>
        <Buttons.Button icon={ mdiCalendarPlus }
                        onClick={ () => dialogControl.open() }
                        label={ 'page.contract.action.schedule' }/>
        <Form entity='Contract' onSubmit={ onSubmit }>
            <Dialog.Dialog title={ 'page.title.schedule.transaction.add' }
                           actions={[
                                <SubmitButton key='submit' label='common.action.save' icon={ mdiContentSave }/>
                           ]}
                           control={ dialogControl }>

                <div className='border-1 text-gray-400 mb-3'>
                    <Translations.Translation label='page.budget.schedule.explained' />
                </div>

                <Entity.ManagedAccount id='from'
                                       required={ true }
                                       title='page.contract.schedule.source' />

                <Input.Amount id='amount'
                              title={ 'ScheduledTransaction.amount' }
                              required={ true } />

                <div className='flex flex-row'>
                    <Translations.Translation className='font-bold flex-1'
                                              label='ScheduledTransaction.schedule' />
                    <span className='flex'>
                        <Input.Text id='interval'
                                    className='pr-1'
                                    type={ 'number' }
                                    required={ true } />
                        <Input.Select id='periodicity'>
                            <Input.SelectOption value={ 'WEEKS' } label={ 'Periodicity.WEEKS' } />
                            <Input.SelectOption value={ 'MONTHS' } label={ 'Periodicity.MONTHS' } />
                            <Input.SelectOption value={ 'YEARS' } label={ 'Periodicity.YEARS' } />
                        </Input.Select>
                    </span>
                </div>
            </Dialog.Dialog>
        </Form>
    </>
}

export default ScheduleContract