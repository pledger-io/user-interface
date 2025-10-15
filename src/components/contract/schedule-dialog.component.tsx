import React, { FC, Ref, useImperativeHandle } from "react";
import { useNotification } from "../../context/notification-context";
import { Entity, Form, Input, SubmitButton } from "../form";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Account, Contract, DialogOptions } from "../../types/types";
import ContractRepository from "../../core/repositories/contract-repository";
import { Button } from "../layout/button";
import { Dialog } from "primereact/dialog";
import { i10n } from "../../config/prime-locale";
import { Message } from "primereact/message";

type ScheduleContractProps = {
  contract: Contract,
  ref: Ref<DialogOptions>
}

type ScheduleContractModel = {
  source: Account,
  from: Account,
  amount: number,
  periodicity: string,
  interval: number
}

const ScheduleContract: FC<ScheduleContractProps> = ({ ref, contract }) => {
  const [visible, setVisible] = React.useState(false);
  const { success, warning } = useNotification();

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onSubmit = (e: ScheduleContractModel) => {
    const contractModel = {
      name: contract.name,
      contract: contract.id,
      transferBetween: {
        source: e.from,
        destination: contract.company
      },
      amount: e.amount,
      schedule: {
        periodicity: e.periodicity,
        interval: e.interval
      }
    }

    ContractRepository.schedule(contractModel)
      .then(() => success('page.contract.schedule.success'))
      .then(() => setVisible(false))
      .catch(() => warning('page.contract.schedule.error'));
  }

  return <>
    <Dialog header={ i10n('page.title.schedule.transaction.add') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <Form entity='Contract' onSubmit={ onSubmit }>

        <Message text={ i10n('page.budget.schedule.explained') } severity='info'/>

        <Entity.ManagedAccount id='from'
                               required={ true }
                               title='page.contract.schedule.source'/>

        <Input.Amount id='amount'
                      title={ 'ScheduledTransaction.amount' }
                      required={ true }/>

        <div className='md:flex gap-4'>
          <Input.Text title='ScheduledTransaction.schedule'
                      id='interval'
                      type='number'
                      className='md:flex-1'
                      required/>

          <Input.Select id='periodicity'
                        title='ScheduledTransaction.periodicity'
                        className='flex-1'
                        value='MONTHS'
                        options={ [
                          { label: 'Periodicity.WEEKS', value: 'WEEKS' },
                          { label: 'Periodicity.MONTHS', value: 'MONTHS' },
                          { label: 'Periodicity.YEARS', value: 'YEARS' }
                        ] }
                        required/>
        </div>

        <div className='flex gap-1 justify-end mt-4'>
          <Button label='common.action.cancel'
                  text
                  type='reset'
                  severity='secondary'
                  onClick={ () => setVisible(false) }
                  icon={ mdiCancel }/>
          <SubmitButton label='common.action.save'
                        icon={ mdiContentSave }
                        data-testid={ `schedule-transaction-submit-${ contract?.id || 1 }` }/>
        </div>
      </Form>
    </Dialog>
  </>
}

export default ScheduleContract
