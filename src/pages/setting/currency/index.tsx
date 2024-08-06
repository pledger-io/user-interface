import { mdiPlus, mdiSquareEditOutline } from "@mdi/js";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";

import { Form, Input } from '../../../components/form'
import { Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Translation from "../../../components/localization/translation.component";
import { CurrencyRepository } from "../../../core/RestAPI";
import { Currency } from "../../../types/types";
import NotificationService from "../../../service/notification.service";

const CurrencyRow = ({ currency }: { currency: Currency }) => {
    const onEnabledChange = (enabled: string) => CurrencyRepository.change(currency.code, enabled)
        .then(() => NotificationService.success('page.settings.currencies.enabled.success'))
        .catch(() => NotificationService.warning('page.settings.currencies.enabled.failed'))

    return (
        <tr className='CurrencyRow'>
            <td>
                <Button icon={ mdiSquareEditOutline } variant='icon' className='primary'
                        href={ `${ currency.code }/edit` }/>
            </td>
            <td>{ currency.symbol }</td>
            <td>{ currency.code }</td>
            <td>{ currency.name }</td>
            <td>{ currency.numberDecimals }</td>
            <td className='Form'>
                <Form onSubmit={ _ => undefined } entity='Currency'>
                    <Input.Toggle id={ `toggle-${ currency.code }` }
                                  value={ currency.enabled }
                                  onChange={ onEnabledChange }/>
                </Form>
            </td>
        </tr>
    )
}
CurrencyRow.propTypes = {
    currency: PropTypes.any
}

const _ = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([])

    useEffect(() => {
        CurrencyRepository.list()
            .then(setCurrencies)
    }, [])

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
            <BreadCrumbItem label='page.settings.currencies.title'/>
        </BreadCrumbs>

        <Card title='page.settings.currencies.title'
              actions={ [<Button label='page.settings.currencies.add'
                                 variant='primary'
                                 icon={ mdiPlus }
                                 key='add'
                                 href='./add'/>] }>
            <table className='Table'>
                <thead>
                <tr>
                    <th className='w-[15px]'/>
                    <th className='w-[10px]'/>
                    <th className='w-[20px]'/>
                    <th><Translation label='Currency.name'/></th>
                    <th className='w-[200px]'><Translation label='Currency.decimalPlaces'/></th>
                    <th className='w-[20px]'><Translation label='Currency.enabled'/></th>
                </tr>
                </thead>
                <tbody>
                { currencies.map(currency => <CurrencyRow key={ currency.code } currency={ currency }/>) }
                </tbody>
            </table>
        </Card>
    </>
}

export default _