import React, { useEffect, useState } from "react";

import { Form, Input } from '../../core/form'
import { BreadCrumbItem, BreadCrumbs, Buttons, Layout, Notifications, Translations } from "../../core";
import { mdiPlus, mdiSquareEditOutline } from "@mdi/js";
import PropTypes from "prop-types";
import { CurrencyRepository } from "../../core/RestAPI";

const CurrencyRow = ({ currency }) => {
    const onEnabledChange = enabled => CurrencyRepository.change(currency.code, enabled)
        .then(() => Notifications.Service.success('page.settings.currencies.enabled.success'))
        .catch(() => Notifications.Service.warning('page.settings.currencies.enabled.failed'))

    return (
        <tr className='CurrencyRow'>
            <td>
                <Buttons.Button icon={mdiSquareEditOutline} variant='icon' className='primary' href={`${currency.code}/edit`}/>
            </td>
            <td>{currency.symbol}</td>
            <td>{currency.code}</td>
            <td>{currency.name}</td>
            <td>{currency.numberDecimals}</td>
            <td className='Form'>
                <Form onSubmit={_ => undefined} entity='Currency'>
                    <Input.Toggle id={`toggle-${currency.code}`}
                                  value={currency.enabled}
                                  onChange={onEnabledChange}/>
                </Form>
            </td>
        </tr>
    )
}
CurrencyRow.propTypes = {
    currency: PropTypes.any
}

export const CurrencyOverview = () => {
    const [currencies, setCurrencies] = useState([])

    useEffect(() => {
        CurrencyRepository.list()
            .then(setCurrencies)
    }, [])

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
            <BreadCrumbItem label='page.settings.currencies.title'/>
        </BreadCrumbs>

        <Layout.Card title='page.settings.currencies.title'
              actions={[<Buttons.Button label='page.settings.currencies.add'
                                        variant='primary'
                                        icon={mdiPlus}
                                        key='add'
                                        href='./add'/>]}>
            <table className='Table'>
                <thead>
                <tr>
                    <th width='15'/>
                    <th width='10' />
                    <th width='20' />
                    <th><Translations.Translation label='Currency.name' /></th>
                    <th width='200'><Translations.Translation label='Currency.decimalPlaces' /></th>
                    <th width='20'><Translations.Translation label='Currency.enabled' /></th>
                </tr>
                </thead>
                <tbody>
                {currencies.map(currency => <CurrencyRow key={currency.code} currency={currency} />)}
                </tbody>
            </table>
        </Layout.Card>
    </>
}
