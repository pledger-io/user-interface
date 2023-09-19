import {Attachment, Buttons, Dialog, Dropdown, Formats, Resolver, Translations} from "../../core";
import {NavLink} from "react-router-dom";
import {FC} from "react";
import {Contract} from "../../core/types";
import {
    mdiCalendarCheck,
    mdiCalendarPlus,
    mdiDotsVertical,
    mdiSquareEditOutline,
    mdiTrashCanOutline,
    mdiUpload
} from "@mdi/js";

type ContractTableProps = {
    contracts: Contract[]
}
const ContractTable: FC<ContractTableProps> = ({contracts = []}) => {
    return <table className='Table'>
        <thead>
        <tr>
            <th><Translations.Translation label='Contract.name' /></th>
            <th><Translations.Translation label='Contract.company' /></th>
            <th><Translations.Translation label='Contract.start' /></th>
            <th><Translations.Translation label='Contract.end' /></th>
            <th/>
        </tr>
        </thead>
        <tbody>
        {contracts.map(contract => <ContractRow key={ contract.id } contract={ contract } />)}
        </tbody>
    </table>
}

export default ContractTable

type ContractRowProps = {
    contract: Contract
}

const ContractRow: FC<ContractRowProps> = ({ contract }) => {
    const dropDownActions = {close: () => undefined}
    const onDelete = () => undefined

    return <tr key={ contract.id }
               onMouseLeave={() => dropDownActions.close()}
               className='group'>
        <td>
            { contract.name }
            <div className='Summary'>{ contract.description }</div>
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
                    <Buttons.Button label='page.contract.action.schedule'
                                    icon={ mdiCalendarPlus }/>

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
