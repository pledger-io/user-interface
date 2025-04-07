import { mdiPlus, mdiSquareEditOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";

import { Form, Input } from '../../../components/form'
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import { CurrencyRepository } from "../../../core/RestAPI";
import { Currency } from "../../../types/types";

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const { success, warning } = useNotification()

  useEffect(() => {
    CurrencyRepository.list()
      .then(setCurrencies)
  }, [])

  const onEnabledChange = (currency: Currency, enabled: string) => CurrencyRepository.change(currency.code, enabled)
    .then(() => success('page.settings.currencies.enabled.success'))
    .catch(() => warning('page.settings.currencies.enabled.failed'))

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.settings.currencies.title') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings.options'/>
      <BreadCrumbItem label='page.settings.currencies.title'/>
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      <div className='flex justify-end'>
        <NavLink to={ '/settings/currencies/add' } key='add'
                 className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
          <Icon path={ mdiPlus } size={ .8 }/> { i10n('page.settings.currencies.add') }
        </NavLink>
      </div>

      <DataTable value={ currencies } loading={ !currencies }>
        <Column className='w-[1rem]' body={ (currency: Currency) => <NavLink to={ `${ currency.code }/edit` }>
          <Icon path={ mdiSquareEditOutline } size={ 1 }/>
        </NavLink> }/>
        <Column field='symbol' className='w-[1rem]'/>
        <Column field='code' className='w-[1rem]'/>
        <Column field='name' header={ i10n('Currency.name') }/>
        <Column field='numberDecimals' header={ i10n('Currency.decimalPlaces') }/>
        <Column header={ i10n('Currency.enabled') }
                className='w-[1rem]'
                body={ (currency: Currency) => <Form onSubmit={ _ => undefined } entity='Currency'>
                  <Input.Toggle id={ `toggle-${ currency.code }` }
                                value={ currency.enabled }
                                onChange={ enabled => onEnabledChange(currency, enabled) }/>
                </Form> }/>
      </DataTable>
    </Card>
  </>
}

export default CurrencyPage
