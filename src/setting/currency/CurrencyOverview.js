import React, {useEffect, useState} from "react";

import {Input} from '../../core/form'
import {BreadCrumbItem, BreadCrumbs, Buttons, Card, Notifications, Translations, When} from "../../core";
import {mdiPlus, mdiSquareEditOutline} from "@mdi/js";
import restAPI from "../../core/RestAPI";
import PropTypes from "prop-types";

class CurrencyService {
    load() {
        return restAPI.get('settings/currencies')
    }

    changeEnabled(currencyCode, enabled) {
        return restAPI.patch(`settings/currencies/${currencyCode}`, {enabled: enabled})
    }
}
const service = new CurrencyService()

const CurrencyRow = ({currency}) => {
    const onEnabledChange = enabled => service.changeEnabled(currency.code, enabled)
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
                <Input.Toggle id={`toggle-${currency.code}`} value={currency.enabled} onChange={onEnabledChange}/>
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
        service.load().then(setCurrencies)
    }, [])

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
            <BreadCrumbItem label='page.settings.currencies.title'/>
        </BreadCrumbs>

        <Card title='page.settings.currencies.title'
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
        </Card>
    </>
}
