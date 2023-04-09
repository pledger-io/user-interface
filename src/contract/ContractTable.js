import {Formats, Resolver, Translations} from "../core";
import {NavLink} from "react-router-dom";

export const ContractTable = ({contracts = []}) => {
    return <table className='Table'>
        <thead>
        <tr>
            <th><Translations.Translation label='Contract.name' /></th>
            <th><Translations.Translation label='Contract.company' /></th>
            <th><Translations.Translation label='Contract.start' /></th>
            <th><Translations.Translation label='Contract.end' /></th>
        </tr>
        </thead>
        <tbody>
        {contracts.map(contract => <ContractRow key={contract.id} contract={contract} />)}
        </tbody>
    </table>
}

const ContractRow = ({contract}) => {
    return <tr key={contract.id}>
        <td>
            {contract.name}
            <div className='Summary'>{contract.description}</div>
        </td>
        <td>
            <NavLink to={`${Resolver.Account.resolveUrl(contract.company)}/transactions`}>
                {contract.company.name}
            </NavLink>
        </td>
        <td><Formats.Date date={contract.start} /></td>
        <td><Formats.Date date={contract.end} /></td>
    </tr>
}
