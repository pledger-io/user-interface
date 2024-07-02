import { FC } from "react";

import { Contract } from "../../../core/types";

import ContractRow from "./row.component";
import Translation from "../../localization/translation.component";

type ContractTableProps = {
    contracts: Contract[],
    onChanges?: () => any
}
const ContractTable: FC<ContractTableProps> = ({ contracts = [], onChanges }) => {
    return <table className='Table'>
        <thead>
        <tr>
            <th><Translation label='Contract.name' /></th>
            <th><Translation label='Contract.company' /></th>
            <th><Translation label='Contract.start' /></th>
            <th><Translation label='Contract.end' /></th>
            <th/>
        </tr>
        </thead>
        <tbody>
        {contracts.map(contract => <ContractRow key={ contract.id } contract={ contract } onChanges={ onChanges } />)}
        </tbody>
    </table>
}

export default ContractTable
