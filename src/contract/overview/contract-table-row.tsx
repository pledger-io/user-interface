import {Contract} from "../../core/types";
import {FC} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Attachment, Buttons, Dialog, Dropdown, Formats, Notifications, Resolver, Translations} from "../../core";
import {mdiCalendarCheck, mdiDotsVertical, mdiSquareEditOutline, mdiTrashCanOutline, mdiUpload} from "@mdi/js";
import ContractRepository from "../../core/repositories/contract-repository";
import ScheduleContract from "../schedule";

type ContractRowProps = {
    contract: Contract
}

const ContractRow: FC<ContractRowProps> = ({ contract }) => {
    const dropDownActions = {close: () => undefined}
    const navigation = useNavigate()

    const onDelete = () => {
        ContractRepository.delete(contract.id)
            .then(() => Notifications.Service.success('page.budget.contracts.delete.success'))
            .then(() => navigation(-1))
            .catch(() => Notifications.Service.warning('page.budget.contracts.delete.failed'))
    }

    return <tr key={ contract.id }
               onMouseLeave={() => dropDownActions.close()}
               className='group'>
        <td>
            <span className='text-lg'><NavLink to={`/contracts/${ contract.id }`}>{ contract.name }</NavLink></span>
            <div className='text-gray-700 text-sm'>{ contract.description }</div>
        </td>
        <td>
            <NavLink to={`${Resolver.Account.resolveUrl(contract.company)}/transactions`}>
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
                                                                               fileCode={ contract.fileToken } /> }
                    { !contract.contractAvailable && <Buttons.Button label='page.budget.contracts.action.uploadContract'
                                                                     variant='secondary'
                                                                     icon={ mdiUpload }/> }

                    <Buttons.Button label='page.title.budget.contracts.warn'
                                    variant='secondary'
                                    icon={ mdiCalendarCheck }/>

                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    icon={mdiSquareEditOutline}
                                    href={`./${ contract.id }/edit`}/>

                    <Dialog.ConfirmPopup title='common.action.delete'
                                         openButton={ <Buttons.Button label='common.action.delete'
                                                                      variant='warning'
                                                                      icon={ mdiTrashCanOutline }/> }
                                         onConfirm={ onDelete }>
                        <Translations.Translation label='page.budget.contracts.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown.Dropdown>
            }
        </td>
    </tr>
}

export default ContractRow