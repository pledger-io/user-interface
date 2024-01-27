import { Link } from "react-router-dom";
import { Buttons, Dialog, Dropdown, Formats, Notifications, Statistical, Translations } from "../../core";
import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../core/types";
import ReconcileButtonsComponent from "./reconcile/reconcile-buttons.component";

type AccountRowProps = {
    account: Account,
    deleteCallback: () => void
}

const AccountRowComponent = ({ account, deleteCallback }: AccountRowProps) => {
    const dropDownActions = { close: () => undefined }
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => Notifications.Service.success('page.account.delete.success'))
        .then(() => deleteCallback())
        .catch(() => Notifications.Service.warning('page.account.delete.failed'))

    let accountLink = `./${account.id}/transactions`
    if (account.type === 'savings' || account.type === 'joined_savings') {
        accountLink = `/accounts/savings/${account.id}/transactions`
    }

    return <tr onMouseLeave={ () => dropDownActions.close() }>
        <td>
            <h2><Link to={ accountLink }>{ account.name }</Link></h2>

            <div className='text-muted pl-1 text-sm'>
                <label className='font-bold mr-1'><Translations.Translation label='Account.type'/>:</label>
                <Translations.Translation label={ `AccountType.${ account.type }` }/>
            </div>
            <div className='text-muted pl-1 text-sm'>
                <label className='font-bold mr-1'><Translations.Translation label='Account.lastActivity'/>:</label>
                <Formats.Date date={ account.history.lastTransaction }/>
            </div>
            <div className='mt-2 pl-1 text-muted text-sm'>{ account.description }</div>
        </td>
        <td>
            { account.account.iban && `${ account.account.iban }` }
            { !account.account.iban && account.account.number && `${ account.account.number }` }
        </td>
        <td><Statistical.Balance accounts={ [account] } currency={ account.account.currency }/></td>
        <td>
            <Dropdown.Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                <Buttons.Button label='common.action.edit'
                                variant='primary'
                                icon={ mdiSquareEditOutline }
                                href={ `./${ account.id }/edit` }/>
                <Dialog.ConfirmPopup title='common.action.delete'
                                     openButton={ <Buttons.Button label='common.action.delete'
                                                                  variant='warning'
                                                                  icon={ mdiTrashCanOutline }/> }
                                     onConfirm={ onDelete }>
                    <Translations.Translation label='page.accounts.delete.confirm'/>
                </Dialog.ConfirmPopup>
                <ReconcileButtonsComponent account={ account } />
            </Dropdown.Dropdown>
        </td>
    </tr>
}

export default AccountRowComponent