import React from "react";
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Dialog,
    Dropdown,
    Formats, Notifications,
    Statistical,
    Translations,
    When
} from "../core";
import {mdiCheck, mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import {Link} from "react-router-dom";
import restAPI from "../core/RestAPI";
import {ReconcileOverview} from "./ReconcileOverview";

class AccountService {
    list() {
        return restAPI.get('accounts/my-own')
    }

    delete(id) {
        return restAPI.delete(`accounts/${id}`)
    }
}

const service = new AccountService()

class AccountRow extends React.Component {
    dropDownActions = {
        close: () => {}
    }

    render() {
        const {account} = this.props

        return (
            <tr onMouseLeave={() => this.dropDownActions.close()}>
                <td><Link to={this.getAccountLink(account)}>{account.name}</Link></td>
                <td><Translations.Translation label={`AccountType.${account.type}`}/></td>
                <td><Formats.Date date={account.history.lastTransaction}/></td>
                <td>
                    <When condition={account.account.iban !== undefined}>{account.account.iban}</When>
                    <When
                        condition={!account.account.iban && account.account.number}>{account.account.number}</When>
                </td>
                <td><Statistical.Balance accounts={[account]} currency={account.account.currency}/></td>
                <td>
                    <Dropdown.Dropdown icon={mdiDotsVertical} actions={this.dropDownActions}>
                        <Buttons.Button label='common.action.edit'
                                        variant='primary'
                                        icon={mdiSquareEditOutline}
                                        href={`./${account.id}/edit`}/>
                        <Dialog.ConfirmPopup title='common.action.delete'
                                             openButton={<Buttons.Button label='common.action.delete'
                                                                         variant='warning'
                                                                         icon={mdiTrashCanOutline}/>}
                                             onConfirm={this.delete.bind(this)}>
                            <Translations.Translation label='page.accounts.delete.confirm'/>
                        </Dialog.ConfirmPopup>
                        <Buttons.Button label='page.reports.default.reconcile' icon={mdiCheck}/>
                    </Dropdown.Dropdown>
                </td>
            </tr>
        )
    }

    getAccountLink(account) {
        if (account.type === 'savings' || account.type === 'joined_savings') {
            return `/accounts/savings/${account.id}/transactions`
        }

        return `./${account.id}/transactions`
    }

    delete() {
        const {account, onDelete} = this.props

        service.delete(account.id)
            .then(() => Notifications.Service.success('page.account.delete.success'))
            .then(() => onDelete())
            .catch(() => Notifications.Service.warning('page.account.delete.failed'))
    }
}

class OwnAccountOverview extends React.Component {
    state = {
        accounts: null
    }

    loadAccounts() {
        service.list()
            .then(results => {
                this.setState({
                    accounts: results
                })
            })
            .catch(exception => console.error(exception));
    }

    render() {
        const {accounts} = this.state
        const reload = () => this.loadAccounts()
        const actionButtons = [<Buttons.Button label='page.account.accounts.add'
                                               key='add'
                                               icon={mdiPlus}
                                               href='./add'
                                               variant='primary'/>]

        if (!accounts) {
            setTimeout(() => this.loadAccounts(), 50)
        }

        const accountRows = (accounts || []).map(account => <AccountRow account={account} key={account.id} onDelete={() => reload()}/>)

        return (
            <div className='OwnAccountOverview'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label='page.nav.accounts.accounts'/>
                </BreadCrumbs>

                <Card title='page.nav.accounts.accounts' actions={actionButtons}>
                    <table className='Table'>
                        <thead>
                        <tr>
                            <th><Translations.Translation label='Account.name'/></th>
                            <th><Translations.Translation label='Account.type'/></th>
                            <th><Translations.Translation label='Account.lastActivity'/></th>
                            <th><Translations.Translation label='Account.number'/></th>
                            <th width='150'><Translations.Translation label='common.account.saldo'/></th>
                            <th width='15'/>
                        </tr>
                        </thead>
                        <tbody>{accountRows}</tbody>
                    </table>
                </Card>

                <ReconcileOverview/>
            </div>
        )
    }
}

export {
    OwnAccountOverview
}
