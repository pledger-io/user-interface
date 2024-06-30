import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React, { Attributes } from "react";
import { Link } from "react-router-dom";
import ImageAttachment from "../../core/attachment/image-attachment";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../core/types";
import NotificationService from "../../service/notification.service";
import BalanceComponent from "../balance.component";
import PercentageComponent from "../format/percentage.component";
import { Button } from "../layout/button";
import { Dropdown } from "../layout/dropdown";
import ConfirmComponent from "../layout/popup/confirm.component";
import Translation from "../localization/translation.component";
import Date from "../../components/format/date.component";

type AccountRowProps = Attributes & {
    account: Account;
    deleteCallback: () => void;
}

const AccountRow = ({ account, deleteCallback }: AccountRowProps) => {
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => NotificationService.success('page.accounts.liability.delete.success'))
        .then(deleteCallback)
        .catch(() => NotificationService.success('page.accounts.liability.delete.failed'))

    return (
        <tr className='AccountRow'>
            <td><ImageAttachment fileCode={ account.iconFileCode }/></td>
            <td>
                <Link to={ `./${ account.id }` }>{ account.name }</Link>
                {  account.history.lastTransaction &&
                    <div className='Text Muted'>
                        <Translation label='Account.lastActivity'/>
                        <Date date={ account.history.lastTransaction }/>
                    </div>
                }
                <div className='Text Muted'>{ account.description }</div>
            </td>
            <td className='hidden md:table-cell'>
                <PercentageComponent percentage={ account.interest.interest } decimals={ 2 }/>
                (<Translation label={ `Periodicity.${ account.interest?.periodicity }` }/>)
            </td>
            <td>
                <BalanceComponent accounts={ [account] } currency={ account.account.currency }/>
            </td>
            <td>
                <Dropdown icon={ mdiDotsVertical }>
                    <Button label='common.action.edit'
                            variant='primary'
                            icon={ mdiSquareEditOutline }
                            href={ `./${ account.id }/edit` }/>
                    <ConfirmComponent title='common.action.delete'
                                      openButton={ <Button label='common.action.delete'
                                                           variant='warning'
                                                           icon={ mdiTrashCanOutline }/> }
                                      onConfirm={ onDelete }>
                        <Translation label='page.accounts.delete.confirm'/>
                    </ConfirmComponent>
                </Dropdown>
            </td>
        </tr>
    )
}

export default AccountRow