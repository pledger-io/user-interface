import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { FC } from "react";
import { NavLink } from "react-router";
import { i10n } from "../../../config/prime-locale";
import { Resolver } from "../../../core";
import { Contract } from "../../../types/types";
import DateComponent from "../../format/date.component";
import ContractMenuActions from "./contract-action-menu";

const NameColumn = ({ contract }: { contract: Contract }) => {
  return <>
    <NavLink className='text-blue-700' to={ `/contracts/${ contract.id }` }>{ contract.name }</NavLink>
    <div className='text-muted text-sm'>{ contract.description }</div>
  </>
}

const CompanyColumn = ({ contract }: { contract: Contract }) => {
  return <NavLink className='text-blue-400' to={ `${ Resolver.Account.resolveUrl(contract.company) }/transactions` }>
    { contract.company.name }
  </NavLink>
}

type ContractTableProps = {
  contracts?: Contract[],
  onChanges: () => void
}
const ContractTable: FC<ContractTableProps> = ({ contracts, onChanges }) => {

  return <DataTable value={ contracts } loading={ !contracts }>
    <Column header={ i10n('Contract.name') }
            body={ contract => <NameColumn contract={ contract }/> }/>
    <Column header={ i10n('Contract.company') }
            body={ contract => <CompanyColumn contract={ contract }/> }/>
    <Column header={ i10n('Contract.start') }
            bodyClassName='w-[10rem]'
            body={ contract => <DateComponent date={ contract.start }/> }/>
    <Column header={ i10n('Contract.end') }
            bodyClassName='w-[10rem]'
            body={ contract => <DateComponent date={ contract.end }/> }/>
    <Column bodyClassName='w-[1rem]' body={ contract => <ContractMenuActions contract={ contract } callback={ onChanges } /> }/>
  </DataTable>
}

export default ContractTable
