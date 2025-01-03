import { Link } from "react-router";
import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../types/types";

import NotificationService from "../../service/notification.service";
import BalanceComponent from "../balance.component";
import DateComponent from "../format/date.component";
import { Button } from "../layout/button";
import { Dropdown } from "../layout/dropdown";
import { Confirm } from "../layout/popup";

import ReconcileButtonsComponent from "./reconcile/reconcile-buttons.component";
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
            <h2 className='text-lg'><Link to={ accountLink }>{ account.name }</Link></h2>

            <div className='text-muted pl-1 text-sm'>
                <label className='font-bold mr-1'><Translation label='Account.type'/>:</label>
                <Translation label={ `AccountType.${ account.type }` }/>
            </div>
            <div className='text-muted pl-1 text-sm'>
                <label className='font-bold mr-1'><Translation label='Account.lastActivity'/>:</label>
                <DateComponent date={ account.history.lastTransaction }/>
            </div>
            <div className='mt-1 pl-1 text-muted text-sm'>{ account.description }</div>
        </td>
        <td className='hidden md:table-cell'>
            { account.account.iban && `${ account.account.iban }` }
            { !account.account.iban && account.account.number && `${ account.account.number }` }
        </td>
        <td><BalanceComponent accounts={ accountArray } currency={ account.account.currency }/></td>
        <td>
            <Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                <Button label='common.action.edit'
                                variant='primary'
                                icon={ mdiSquareEditOutline }
                                href={ `./${ account.id }/edit` }/>
                <Confirm title='common.action.delete'
                                         openButton={ <Button label='common.action.delete'
                                                                  variant='warning'
                                                                  icon={ mdiTrashCanOutline }/> }
                                         onConfirm={ onDelete }>
                    <Translation label='page.accounts.delete.confirm'/>
                </Confirm>
                <ReconcileButtonsComponent account={ account } />
            </Dropdown>
        </td>
    </tr>
}

export default AccountRowComponent