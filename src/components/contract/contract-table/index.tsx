import { FC } from "react";

import { Translations } from "../../../core";
import { Contract } from "../../../core/types";

import ContractRow from "./row.component";

type ContractTableProps = {
    contracts: Contract[],
    onChanges?: () => any
}
const ContractTable: FC<ContractTableProps> = ({ contracts = [], onChanges }) => {
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
        {contracts.map(contract => <ContractRow key={ contract.id } contract={ contract } onChanges={ onChanges } />)}
        </tbody>
    </table>
}

export default ContractTable
