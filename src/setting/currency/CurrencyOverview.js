import React from "react";

import {Input} from '../../core/form'
import {BreadCrumbItem, BreadCrumbs, Buttons, Card, Notifications, Translations, When} from "../../core";
import {mdiPlus, mdiSquareEditOutline} from "@mdi/js";
import restAPI from "../../core/RestAPI";

class CurrencyService {
    load() {
        return restAPI.get('settings/currencies')
    }

    changeEnabled(currencyCode, enabled) {
        return restAPI.patch(`settings/currencies/${currencyCode}`, {enabled: enabled})
    }
}
const service = new CurrencyService()

class CurrencyRow extends React.Component {
    onEnabledChange(enabled) {
        const {currency: {code}} = this.props

        service.changeEnabled(code, enabled)
            .then(() => Notifications.Service.success('page.settings.currencies.enabled.success'))
            .catch(() => Notifications.Service.warning('page.settings.currencies.enabled.failed'))
    }

    render() {
        const {currency} = this.props

        return <tr className='CurrencyRow'>
            <td>
                <Buttons.Button icon={mdiSquareEditOutline} variant='icon' className='primary' href={`${currency.code}/edit`}/>
            </td>
            <td>{currency.symbol}</td>
            <td>{currency.code}</td>
            <td>{currency.name}</td>
            <td>{currency.numberDecimals}</td>
            <td className='Form'>
                <Input.Toggle id={`toggle-${currency.code}`} value={currency.enabled} onChange={this.onEnabledChange.bind(this)}/>
            </td>
        </tr>
    }
}

class CurrencyOverview extends React.Component {
    state = {
        currencies: null,
        exception: null
    }

    render() {
        const {currencies} = this.state

        if (!currencies) {
            service.load()
                .then(currencies => this.setState({
                    currencies: currencies
                }))
                .catch(exception => this.setState({
                    exception: exception
                }))
        }

        const currencyRows = (currencies || []).map(currency => <CurrencyRow key={currency.code} currency={currency} />)
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
                    <When condition={currencies != null}>
                        {currencyRows}
                    </When>
                    </tbody>
                </table>
            </Card>
        </>
    }
}

export {
    CurrencyOverview
}
