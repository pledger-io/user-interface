import React from "react";
import PropTypes from 'prop-types';
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card, Dialog, Dropdown,
    Formats, Notifications,
    Pagination,
    Statistical,
    Translations,
    When
} from "../../core";
import {mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import restAPI from "../../core/RestAPI";
import {Link} from "react-router-dom";

class AccountService {
    list(page = 1) {
        return restAPI.post('accounts', {
            accountTypes: [
                'loan',
                'mortgage',
                'debt'
            ],
            page: page
        })
    }

    delete(id) {
        return restAPI.delete(`accounts/${id}`)
    }
}

const service = new AccountService();

/**
 * An account row component will display the information of a single account into a row of a table.
 */
class AccountRow extends React.Component {
    static propTypes = {
        // The actual liability account to display
        account: PropTypes.any.isRequired,
        // The method that will be called if the account is deleted
        onDelete: PropTypes.func.isRequired
    }

    render() {
        const {account} = this.props

        return (
            <tr className='AccountRow'>
                <td><Attachments.Image fileCode={account.iconFileCode}/></td>
                <td>
                    <Link to={`./${account.id}`}>{account.name}</Link>
                    <When condition={account.history.lastTransaction !== null}>
                        <div className='Text Muted'>
                            <Translations.Translation label='Account.lastActivity'/>
                            <Formats.Date date={account.history.lastTransaction}/>
                        </div>
                    </When>
                    <div className='Text Muted'>{account.description}</div>
                </td>
                <td>
                    <Formats.Percent percentage={account.interest.interest} decimals={2} />
                    (<Translations.Translation label={`Periodicity.${account.interest?.periodicity}`}/>)
                </td>
                <td>
                    <Statistical.Balance accounts={[account]} currency={account.account.currency}/>
                </td>
                <td>
                    <Dropdown.Dropdown icon={mdiDotsVertical}>
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

        service.delete(account.id)
            .then(() => Notifications.Service.success('page.accounts.liability.delete.success'))
            .then(() => onDelete())
            .catch(() => Notifications.Service.success('page.accounts.liability.delete.failed'))
    }
}

class LiabilityOverview extends React.Component {
    loading = false

    constructor(props, context) {
        super(props, context);

        const {queryContext} = this.props
        this.state = {
            pageNumber: queryContext.page,
            accounts: null,
            pagination: {}
        }
        queryContext.resolved = searchQuery => {}
    }

    setPageNumber(pageNumber) {
        service.list(pageNumber)
            .then(resultPage => {
                const {content, info} = resultPage;
                this.setState({
                    pageNumber: parseInt(pageNumber) || 1,
                    accounts: content,
                    pagination: info
                })
            })
            .catch(exception => console.error(exception))
            .finally(() => this.loading = false)
    }

    render() {
        const {pageNumber, accounts, pagination} = this.state
        const reload = () => this.setPageNumber(pageNumber)
        const headerButtons = [<Buttons.Button label='page.title.accounts.liabilities.add'
                                               key='add'
                                               icon={mdiPlus}
                                               href='./add'
                                               variant='primary'/>]

        if (!this.loading && !accounts) {
            this.setPageNumber(pageNumber)
        }

        const accountRows = (accounts || [])
            .map(account => <AccountRow key={account.id} account={account} onDelete={() => reload()}/>)

        return (
            <div className='LiabilityOverview'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label='page.nav.accounts.liability'/>
                </BreadCrumbs>

                <Card title='page.nav.accounts.liability' actions={headerButtons}>
                    <table className='Table'>
                        <thead>
                        <tr>
                            <th width='50'/>
                            <th><Translations.Translation label='Account.name'/></th>
                            <th width='150'>
                                <Translations.Translation label='Account.interest'/>
                                (<Translations.Translation label='Account.interestPeriodicity'/>)
                            </th>
                            <th width='70'><Translations.Translation label='common.account.saldo'/></th>
                            <th width='25' />
                        </tr>
                        </thead>
                        <tbody>
                        {accountRows}
                        </tbody>
                    </table>

                    <Pagination.Paginator page={pageNumber} records={pagination.records}
                                          pageSize={pagination.pageSize}/>
                </Card>
            </div>
        )
    }
}

export {
    LiabilityOverview
}
