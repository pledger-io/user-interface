import React, { FC } from "react";
import { Identifiable } from "../../core/types";
import { Entity, Form, Input } from "../form";
import { mdiFilter } from "@mdi/js";
import { Button } from "../layout/button";
import Translation from "../localization/translation.component";

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
    onChange: FilterChangeHandler
}

const TransactionFilters: FC<TransactionFiltersProps> = ({ onChange }) => {

    const onSubmit = (form: any) => {
        const filter = {
            account: form.account?.name,
            category: form.category,
            budget: form.budget,
            onlyIncome: form.onlyIncome,
            onlyExpenses: form.onlyExpenses,
            description: form.description,
            currency: form.currency?.id
        }

        onChange(filter)
    }

    return <div className='max-w-[90em] mx-auto my-0 mobile-hidden'>
        <Form entity='Transaction' onSubmit={ onSubmit }>
            <fieldset className='!border-solid !border-[1px] !border-separator'>
                <legend className='text-xl font-normal px-2'>
                    <Translation label='page.transactions.filter'/>
                </legend>

                <div className='flex px-2 gap-2'>
                    <Entity.Account id='account'
                                    title='page.transactions.filter.account'
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
                                   title='page.transactions.filter.budget'/>
                    <div className='flex-1'/>
                </div>

                <div className='flex px-2 pb-1 items-center gap-2'>
                    <Input.Toggle id='onlyExpense' className='w-8'/>
                    <Translation label='page.transaction.filter.expense' className='flex-auto'/>
                </div>
                <div className='flex px-2 items-center gap-2'>
                    <Input.Toggle id='onlyIncome' className='w-8'/>
                    <Translation label='page.transaction.filter.income' className='flex-auto'/>
                </div>

                <Button type='submit'
                        label='page.transactions.filter'
                        icon={ mdiFilter }
                        variant='secondary'
                        className='mx-auto my-2'/>
            </fieldset>
        </Form>
    </div>
}

export default TransactionFilters