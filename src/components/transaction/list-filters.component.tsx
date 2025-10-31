import React, { FC } from "react";
import { i10n } from "../../config/prime-locale";
import { Identifiable } from "../../types/types";
import { Entity, Form, Input } from "../form";
import { mdiFilter } from "@mdi/js";
import { Button } from "../layout/button";

export type TransactionFilter = {
  account?: string,
  category?: Identifiable,
  budget?: Identifiable,
  onlyIncome?: boolean,
  onlyExpenses?: boolean,
  description?: string,
  currency?: string,
}
export type FilterChangeHandler = (_: TransactionFilter) => void

type TransactionFiltersProps = {
  onChange: FilterChangeHandler,
  activeFilter: TransactionFilter
}

const TransactionFilters: FC<TransactionFiltersProps> = ({ onChange, activeFilter }) => {

  const onSubmit = (form: any) => {
    const type = form.onlyIncome == form.onlyExpense ? '' : (form.onlyExpense ? 'EXPENSE' : 'INCOME');
    const filter = {
      account: form.account?.id,
      category: form.category?.id,
      expense: form.budget?.id,
      type: type,
      description: form.description,
      currency: form.currency
    }

    onChange(filter)
  }

  return <div className='max-w-[90em] mx-auto my-4 hidden md:block'>
    <Form entity='Transaction' onSubmit={ onSubmit }>
      <fieldset className='border-solid! border-[1px]! border-separator!'>
        <legend className='text-xl font-normal px-2'>{ i10n('page.transactions.filter') }</legend>

        <div className='flex px-2 gap-2'>
          <Entity.Account id='account'
                          title='page.transactions.filter.account'
                          type={ ['debtor', 'creditor'] }
                          className='flex-1'
                          inputOnly={ true }/>
          <Input.Text id='description'
                      type='text'
                      className='flex-1'
                      title='page.transaction.filter.description'/>
          <Entity.Currency id='currency'
                           className='flex-1'
                           title='page.transaction.filter.currency'/>
        </div>

        <div className='flex px-2 gap-2 flex-1'>
          <Entity.Category id='category'
                           className='flex-1'
                           inputOnly={ true }
                           title='page.transactions.filter.category'/>
          <Entity.Budget id='budget'
                         className='flex-1'
                         value={ activeFilter.budget }
                         title='page.transactions.filter.budget'/>
          <div className='flex-1'/>
        </div>

        <div className='flex px-2 pb-1 items-center gap-2'>
          <Input.Toggle id='onlyExpense' className='w-8'/>
          <span className='flex-auto'>{i10n('page.transaction.filter.expense')}</span>
        </div>
        <div className='flex px-2 items-center gap-2'>
          <Input.Toggle id='onlyIncome' className='w-8'/>
          <span className='flex-auto'>{i10n('page.transaction.filter.income')}</span>
        </div>

        <div className='flex justify-center mb-4'>
          <Button type='submit'
                  label='page.transactions.filter'
                  outlined={ true }
                  icon={ mdiFilter }
                  severity='secondary' />
        </div>
      </fieldset>
    </Form>
  </div>
}

export default TransactionFilters
