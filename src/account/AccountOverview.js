import React from "react";
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Dialog,
    Dropdown,
    Formats,
    Notifications,
    Pagination,
    Statistical,
    Translations,
    When
} from "../core";
import restAPI from "../core/RestAPI";
import {NavLink} from "react-router-dom";
import {mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";

import '../assets/css/AccountOverview.scss'

class AccountService {
    list(type = [], page = 1, nameFilter = null) {
        return restAPI.post('accounts', {
            accountTypes: type,
            page: page,
            name: nameFilter
        })
    }

    delete(account) {
        return restAPI.delete(`accounts/${account.id}`)
    }
}

const service = new AccountService();

class AccountRow extends React.Component {
    dropDownActions = {
        close: () => {}
    }

    render() {
        const {account} = this.props;

        return (
            <tr className='AccountRow' onMouseLeave={() => this.dropDownActions.close()}>
                <td><Attachments.Image fileCode={account.iconFileCode}/></td>
                <td>
                    <NavLink to={`./${account.id}/transactions`}>{account.name}</NavLink>
                    <When condition={account.history.lastTransaction !== null}>
                        <div className='Text Muted'>
                            <Translations.Translation label='Account.lastActivity'/>
                            <Formats.Date date={account.history?.lastTransaction}/>
                        </div>
                    </When>
                    <div className='Text Muted'>{account.description}</div>
                </td>
                <td>
                    <When condition={account.account.iban !== null}>{account.account.iban}</When>
                    <When condition={account.account.iban === null && account.account.number}>{account.account.number}</When>
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
                    </Dropdown.Dropdown>
                </td>
            </tr>
        )
    }

    delete() {
        const {account, onDelete} = this.props

        service.delete(account)
            .then(() => Notifications.Service.success('page.account.delete.success'))
            .then(() => onDelete())
            .catch(() => Notifications.Service.warning('page.account.delete.failed'))
    }
}

class AccountOverview extends React.Component {
    loading = false;

    constructor(props, context) {
        super(props, context);

        const {queryContext} = props;
        this.state = {
            pageNumber: queryContext.page,
            accounts: null,
            pagination: {}
        }
        queryContext.resolved = searchQuery => this.setPageNumber(searchQuery.page);
    }

    setPageNumber(pageNumber) {
        const {type} = this.props;

        this.loading = true;
        service.list([type], pageNumber)
            .then(resultPage => {
                const {content, info} = resultPage;
                this.setState({
                    pageNumber: parseInt(pageNumber) || 1,
                    accounts: content,
                    pagination: info
                })
                this.loading = false;
            })
            .catch(exception => console.error(exception));
    }

    render() {
        const {type} = this.props;
        const {accounts, pageNumber} = this.state;
        const label = `page.nav.accounts.${type}`;

        const reload = () => this.setPageNumber(pageNumber)
        const headerButtons = [<Buttons.Button label={`page.account.${type}.add`}
                                               key='add'
                                               icon={mdiPlus}
                                               href='./add'
                                               variant='primary'/>]

        if (!this.loading && !accounts) {
            this.setPageNumber(pageNumber);
        }

        const accountViews = (accounts || []).map(account => <AccountRow key={account.id} account={account} onDelete={() => reload()}/>);

        return (
            <div className='AccountOverview'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label={label}/>
                </BreadCrumbs>

                <Card title={label} actions={headerButtons}>
                    <table className='Table AccountTable'>
                        <thead>
                        <tr>
                            <th width='30'/>
                            <th><Translations.Translation label='Account.name'/></th>
                            <th width='150'><Translations.Translation label='Account.number'/></th>
                            <th width='110'><Translations.Translation label='common.account.saldo'/></th>
                            <th width='20'/>
                        </tr>
                        </thead>
                        <tbody>
                        {accountViews}
                        </tbody>
                    </table>

                    <Pagination.Paginator page={this.state.pageNumber} records={this.state.pagination.records}
                                          pageSize={this.state.pagination.pageSize}/>
                </Card>
            </div>
        )
    }
}

export {
    AccountOverview
}
