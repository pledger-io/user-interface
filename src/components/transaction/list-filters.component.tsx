import { Dialog } from "primereact/dialog";
import React, { FC, useMemo, useState } from "react";
import { i10n } from "../../config/prime-locale";
import { Identifiable } from "../../types/types";
import { Entity, Form, Input } from "../form";
import { Button } from "../layout/button";
import { normalizeFilterState } from "./transaction-filters.utils";

export type TransactionFilter = {
  account?: Identifiable | string,
  category?: Identifiable,
  budget?: Identifiable,
  uncategorized?: boolean,
  onlyIncome?: boolean,
  onlyExpenses?: boolean,
  description?: string,
  currency?: string,
  type?: string,
}
export type FilterChangeHandler = (_: TransactionFilter) => void

type TransactionFiltersProps = {
  onChange: FilterChangeHandler,
  activeFilter: TransactionFilter,
  transfers?: boolean
}

const TransactionFilters: FC<TransactionFiltersProps> = ({ onChange, activeFilter, transfers = false }) => {
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false)
  const activeFilterKey = useMemo(() => JSON.stringify({
    account: activeFilter.account,
    category: activeFilter.category,
    budget: activeFilter.budget,
    uncategorized: activeFilter.uncategorized,
    onlyIncome: activeFilter.onlyIncome,
    onlyExpenses: activeFilter.onlyExpenses,
    description: activeFilter.description,
    currency: activeFilter.currency
  }), [activeFilter])

  const onSubmit = (form: any) => {
    const onlyIncome = Boolean(activeFilter.onlyIncome || activeFilter.type === 'INCOME')
    const onlyExpenses = Boolean(activeFilter.onlyExpenses || activeFilter.type === 'EXPENSE')
    const filter = normalizeFilterState({
      account: form.account || undefined,
      category: form.category || undefined,
      budget: form.budget || undefined,
      uncategorized: Boolean(activeFilter.uncategorized),
      onlyIncome,
      onlyExpenses,
      description: form.description || undefined,
      currency: form.currency || undefined
    }, transfers)

    onChange(filter)
    setMobileFilterVisible(false)
  }

  const renderFilterFields = () => <>
    <div className='grid grid-cols-1 md:grid-cols-3 px-2 gap-2'>
      <Entity.Account id='account'
                      title='page.transactions.filter.account'
                      type={ ['debtor', 'creditor'] }
                      value={ activeFilter.account as any }
                      className='flex-1'
                      inputOnly={ true }/>
      <Input.Text id='description'
                  type='text'
                  value={ activeFilter.description }
                  className='flex-1'
                  title='page.transaction.filter.description'/>
      <Entity.Currency id='currency'
                       className='flex-1'
                       value={ activeFilter.currency }
                       title='page.transaction.filter.currency'/>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-3 px-2 gap-2 flex-1'>
      <Entity.Category id='category'
                       className='flex-1'
                       value={ activeFilter.category as any }
                       inputOnly={ true }
                       title='page.transactions.filter.category'/>
      <Entity.Budget id='budget'
                     className='flex-1'
                     value={ activeFilter.budget as any }
                     title='page.transactions.filter.budget'/>
      <div className='hidden md:block'/>
    </div>

  </>

  const renderForm = (className: string) => <div className={ className }>
    <Form key={ activeFilterKey } entity='Transaction' onSubmit={ onSubmit }>
      <fieldset className='border-solid! border! border-separator! rounded-md'>
        <legend className='text-xl font-normal px-2'>{ i10n('page.transactions.filter') }</legend>
        { renderFilterFields() }
        <div className='flex justify-center mb-4 mt-2'>
          <Button type='submit'
                  label='page.transactions.filter'
                  outlined={ true }
                  icon={ 'mdi:filter' }
                  severity='secondary' />
        </div>
      </fieldset>
    </Form>
  </div>

  return <>
    { renderForm('max-w-[90em] mx-auto my-4 hidden md:block') }
    <div className='max-w-[90em] mx-auto my-3 md:hidden px-2'>
      <Button label='page.transactions.filters.mobile.open'
              icon='mdi:filter-variant'
              severity='secondary'
              outlined
              onClick={ () => setMobileFilterVisible(true) }/>
    </div>
    <Dialog header={ i10n('page.transactions.filters.mobile.title') }
            visible={ mobileFilterVisible }
            dismissableMask
            className='w-[95vw] max-w-[40rem]'
            onHide={ () => setMobileFilterVisible(false) }>
      { renderForm('my-0') }
    </Dialog>
  </>
}

export default TransactionFilters
