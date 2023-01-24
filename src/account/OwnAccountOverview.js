import React, {useEffect, useState} from "react";
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Dialog,
    Dropdown,
    Formats, Loading,
    Notifications,
    Statistical,
    Translations
} from "../core";
import {mdiCheck, mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import {Link, useNavigate} from "react-router-dom";
import {AccountRepository} from "../core/RestAPI";
import {ReconcileOverview} from "./ReconcileOverview";
import {EntityShapes} from "../config";
import PropTypes from "prop-types";

const AccountRow = ({account, deleteCallback}) => {

    const dropDownActions = {}
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => Notifications.Service.success('page.account.delete.success'))
        .then(() => deleteCallback())
        .catch(() => Notifications.Service.warning('page.account.delete.failed'))

    let accountLink = `./${account.id}/transactions`
    if (account.type === 'savings' || account.type === 'joined_savings') {
        accountLink = `/accounts/savings/${account.id}/transactions`
    }

    return (
        <tr onMouseLeave={() => dropDownActions.close()}>
            <td><Link to={accountLink}>{account.name}</Link></td>
            <td><Translations.Translation label={`AccountType.${account.type}`}/></td>
            <td><Formats.Date date={account.history.lastTransaction}/></td>
            <td>
                {account.account.iban && `${account.account.iban}`}
                {!account.account.iban && account.account.number && `${account.account.number}`}
            </td>
            <td><Statistical.Balance accounts={[account]} currency={account.account.currency}/></td>
            <td>
                <Dropdown.Dropdown icon={mdiDotsVertical} actions={dropDownActions}>
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
                    <Buttons.Button label='page.reports.default.reconcile' icon={mdiCheck}/>
                </Dropdown.Dropdown>
            </td>
        </tr>
    )
}
AccountRow.propTypes = {
    account: EntityShapes.Account,
    deleteCallback: PropTypes.func
}

const OwnAccountOverview = () => {
    const [accounts, setAccounts] = useState(undefined)
    const navigate                = useNavigate()

    useEffect(() => {
        AccountRepository.own().then(setAccounts)
    }, [])

    return (
        <div className='OwnAccountOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.accounts'/>
            </BreadCrumbs>

            <Card title='page.nav.accounts.accounts' actions={
                [<Buttons.Button label='page.account.accounts.add'
                                 key='add'
                                 icon={mdiPlus}
                                 href='./add'
                                 variant='primary'/>]}>
                <Loading condition={accounts}>
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
                        <tbody>
                            {(accounts || []).map(account =>
                                <AccountRow account={account} key={account.id} onDelete={() => navigate('.')}/>)}
                        </tbody>
                    </table>
                </Loading>
            </Card>

            <ReconcileOverview/>
        </div>
    )
}

export default OwnAccountOverview
