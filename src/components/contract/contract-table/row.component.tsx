import { Contract } from "../../../core/types";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Attachment, Buttons, Dialog, Dropdown, Formats, Notifications, Resolver } from "../../../core";
import { mdiCalendarCheck, mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import ContractRepository from "../../../core/repositories/contract-repository";

import ScheduleContract from "../schedule-dialog.component";
import UploadContract from "../upload-dialog.component";
import Translation from "../../localization/translation.component";

type ContractRowProps = {
    contract: Contract,
    onChanges?: () => any
}

const ContractRow: FC<ContractRowProps> = ({ contract , onChanges }) => {
    const dropDownActions = { close: () => undefined }

    const onDelete = () => {
        ContractRepository.delete(contract.id)
            .then(() => Notifications.Service.success('page.budget.contracts.delete.success'))
            .then(() => onChanges && onChanges())
            .catch(() => Notifications.Service.warning('page.budget.contracts.delete.failed'))
    }
    const onWarnClick = () => {
        ContractRepository.warn(contract.id)
            .then(() => Notifications.Service.success('page.title.budget.contracts.warn.success'))
            .catch(() => Notifications.Service.warning('page.title.budget.contracts.warn.failed'))
    }

    return <tr key={ contract.id }
               onMouseLeave={ () => dropDownActions.close() }
               className='group'>
        <td>
            <span className='text-lg'><NavLink to={`/contracts/${ contract.id }`}>{ contract.name }</NavLink></span>
            <div className='text-gray-700 text-sm'>{ contract.description }</div>
        </td>
        <td>
            <NavLink to={ `${Resolver.Account.resolveUrl(contract.company)}/transactions` }>
                { contract.company.name }
            </NavLink>
        </td>
        <td><Formats.Date date={ contract.start } /></td>
        <td><Formats.Date date={ contract.end } /></td>
        <td width='25' className='align-middle'>
            {!contract.terminated &&
                <Dropdown.Dropdown icon={ mdiDotsVertical }
                                   className={`invisible group-hover:visible`}
                                   actions={ dropDownActions }>
                    <ScheduleContract contract={ contract } />

                    { contract.contractAvailable && <Attachment.DownloadButton title='page.budget.contracts.action.downloadContract'
                                                                               fileName={ `Contract-${contract.name}.pdf` }
                                                                               fileCode={ contract.fileToken } /> }
                    { !contract.contractAvailable && <UploadContract id={ contract.id } onChanges={ onChanges } /> }

                    { !contract.notification && <Buttons.Button label='page.title.budget.contracts.warn'
                                                                variant='secondary'
                                                                onClick={ onWarnClick }
                                                                icon={ mdiCalendarCheck }/> }

                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    icon={ mdiSquareEditOutline }
                                    href={ `./${ contract.id }/edit` }/>

                    <Dialog.Confirm title='common.action.delete'
                                             openButton={ <Buttons.Button label='common.action.delete'
                                                                      variant='warning'
                                                                      icon={ mdiTrashCanOutline }/> }
                                             onConfirm={ onDelete }>
                        <Translation label='page.budget.contracts.delete.confirm'/>
                    </Dialog.Confirm>
                </Dropdown.Dropdown>
            }
        </td>
    </tr>
}

export default ContractRow