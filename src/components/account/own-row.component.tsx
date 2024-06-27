import { Link } from "react-router-dom";
import { Buttons, Dialog, Dropdown, Formats, Statistical } from "../../core";
import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../core/types";

import NotificationService from "../../service/notification.service";

import ReconcileButtonsComponent from "../../account/own-accounts/reconcile/reconcile-buttons.component";
import Translation from "../localization/translation.component";

type AccountRowProps = {
    account: Account,
    deleteCallback: () => void
}

const AccountRowComponent = ({ account, deleteCallback }: AccountRowProps) => {
    const dropDownActions = { close: () => undefined }
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => NotificationService.success('page.account.delete.success'))
        .then(() => deleteCallback())
        .catch(() => NotificationService.warning('page.account.delete.failed'))

    let accountLink = `./${account.id}/transactions`
    if (account.type === 'savings' || account.type === 'joined_savings') {
        accountLink = `/accounts/savings/${account.id}/transactions`
    }

    const accountArray = [account]
    return <tr onMouseLeave={ () => dropDownActions.close() }>
        <td>
            <h2><Link to={ accountLink }>{ account.name }</Link></h2>

            <div className='text-muted pl-1 text-sm'>
                <label className='font-bold mr-1'><Translation label='Account.type'/>:</label>
                <Translation label={ `AccountType.${ account.type }` }/>
            </div>
            <div className='text-muted pl-1 text-sm'>
                <label className='font-bold mr-1'><Translation label='Account.lastActivity'/>:</label>
                <Formats.Date date={ account.history.lastTransaction }/>
            </div>
            <div className='mt-2 pl-1 text-muted text-sm'>{ account.description }</div>
        </td>
        <td className='hidden md:table-cell'>
            { account.account.iban && `${ account.account.iban }` }
            { !account.account.iban && account.account.number && `${ account.account.number }` }
        </td>
        <td><Statistical.Balance accounts={ accountArray } currency={ account.account.currency }/></td>
        <td>
            <Dropdown.Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                <Buttons.Button label='common.action.edit'
                                variant='primary'
                                icon={ mdiSquareEditOutline }
                                href={ `./${ account.id }/edit` }/>
                <Dialog.Confirm title='common.action.delete'
                                         openButton={ <Buttons.Button label='common.action.delete'
                                                                  variant='warning'
                                                                  icon={ mdiTrashCanOutline }/> }
                                         onConfirm={ onDelete }>
                    <Translation label='page.accounts.delete.confirm'/>
                </Dialog.Confirm>
                <ReconcileButtonsComponent account={ account } />
            </Dropdown.Dropdown>
        </td>
    </tr>
}

export default AccountRowComponent