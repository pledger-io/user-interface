import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Dialog,
    Dropdown,
    Formats,
    Layout,
    Notifications,
    Pagination,
    Statistical,
    Translations,
    When
} from "../../core";
import {mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import {Link} from "react-router-dom";
import {useQueryParam} from "../../core/hooks";
import {EntityShapes} from "../../config";
import AccountRepository from "../../core/repositories/account-repository";

const AccountRow = ({account, deleteCallback}) => {
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => Notifications.Service.success('page.accounts.liability.delete.success'))
        .then(deleteCallback)
        .catch(() => Notifications.Service.success('page.accounts.liability.delete.failed'))

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
                                         onConfirm={onDelete}>
                        <Translations.Translation label='page.accounts.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown.Dropdown>
            </td>
        </tr>
    )
}
AccountRow.propTypes = {
    // The actual liability account to display
    account: EntityShapes.Account,
    // The method that will be called if the account is deleted
    deleteCallback: PropTypes.func.isRequired
}

const LiabilityOverview = () => {
    const [page]                             = useQueryParam({key: 'page', initialValue: "1"})
    const [accounts, setAccounts]            = useState([])
    const [pagination, setPagination]        = useState({})

    const reload = () => {
        AccountRepository.search({
            types: ['loan', 'mortgage', 'debt'],
            page: parseInt(page)
        }).then(resultPage => setAccounts(resultPage.content) || setPagination(resultPage.info))
    }

    useEffect(reload, [page])

    return (
        <div className='LiabilityOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.liability'/>
            </BreadCrumbs>

            <Layout.Card title='page.nav.accounts.liability'
                  actions={[<Buttons.Button label='page.title.accounts.liabilities.add'
                                           key='add'
                                           icon={mdiPlus}
                                           href='./add'
                                           variant='primary'/>]}>
                <table className='Table'>
                    <thead>
                    <tr>
                        <th width='30'/>
                        <th><Translations.Translation label='Account.name'/></th>
                        <th width='150'>
                            <Translations.Translation label='Account.interest'/>
                            (<Translations.Translation label='Account.interestPeriodicity'/>)
                        </th>
                        <th width='120'><Translations.Translation label='common.account.saldo'/></th>
                        <th width='25' />
                    </tr>
                    </thead>
                    <tbody>
                        {accounts.map(a => <AccountRow key={a.id} account={a} deleteCallback={reload}/>)}
                    </tbody>
                </table>

                <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                                      pageSize={pagination.pageSize}/>
            </Layout.Card>
        </div>
    )
}

export default LiabilityOverview
