import React, { useEffect, useState } from "react";
import AccountRepository from "../../../core/repositories/account-repository";
import { Attachment } from "../../../core";
import { Account } from "../../../types/types";
import MoneyComponent from "../../format/money.component";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { i10n } from "../../../config/prime-locale";
import { FilterMatchMode, SortOrder } from "primereact/api";

type TopAccountTableProps = {
  year: number,
  type: string
}

type TopAccount = {
  account: Account,
  total: number,
  average: number
}

const TopAccountTable = ({ year, type }: TopAccountTableProps) => {
  const [accounts, setAccounts] = useState<TopAccount[] | undefined>()

  useEffect(() => {
    AccountRepository.top(type, year)
      .then(setAccounts)
  }, [year, type])

  const sortOrder = type == 'creditor' ? SortOrder.DESC : SortOrder.ASC
  return <>
    <DataTable value={ accounts } loading={ !accounts } size='small' rows={ 10 } paginator sortField='total' sortOrder={ sortOrder }>
      <Column className='w-[3rem]' headerClassName='!bg-[unset]' body={ ({ account }) => <>
        { account.iconFileCode && <Attachment.Image fileCode={ account.iconFileCode }/> }
      </>} />
      <Column header={ i10n('Account.name') } field='account.name' headerClassName='!bg-[unset]' filter filterMatchMode={FilterMatchMode.CONTAINS} />
      <Column header={ i10n('common.total') }
              sortable
              sortField='total'
              headerClassName='!bg-[unset] w-[7rem]'
              className='!text-right'
              body={ account => <MoneyComponent money={ account.total * -1 } currency={ account.account.account.currency }/>}/>
      <Column header={ i10n('common.average') }
              headerClassName='!bg-[unset] w-[5rem]'
              sortable
              sortField='average'
              className='!text-right'
              body={ account => <MoneyComponent money={ account.average * -1 } currency={ account.account.account.currency }/>}/>
    </DataTable>
  </>
}

export default TopAccountTable
