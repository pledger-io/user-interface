import { mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React, { Attributes } from "react";
import { Link } from "react-router-dom";
import { When } from "../../core";
import ImageAttachment from "../../core/attachment/image-attachment";
import { Percent } from "../../core/Formatters";
import AccountRepository from "../../core/repositories/account-repository";
import { Balance } from "../../core/Statistical";
import { Account } from "../../core/types";
import NotificationService from "../../service/notification.service";
import { Button } from "../layout/button";
import { Dropdown } from "../layout/dropdown";
import ConfirmComponent from "../layout/popup/confirm.component";
import Translation from "../localization/translation.component";
import { Date as FormattedDate } from "../../core/Formatters"

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
                <When condition={ account.history.lastTransaction !== null }>
                    <div className='Text Muted'>
                        <Translation label='Account.lastActivity'/>
                        <FormattedDate date={ account.history.lastTransaction }/>
                    </div>
                </When>
                <div className='Text Muted'>{ account.description }</div>
            </td>
            <td className='hidden md:table-cell'>
                <Percent percentage={ account.interest.interest } decimals={ 2 }/>
                (<Translation label={ `Periodicity.${ account.interest?.periodicity }` }/>)
            </td>
            <td>
                <Balance accounts={ [account] } currency={ account.account.currency }/>
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