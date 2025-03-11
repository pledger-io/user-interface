import React, { useEffect } from "react";
import { Account } from "../../../types/types";
import AccountRepository from "../../../core/repositories/account-repository";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import MoneyComponent from "../../format/money.component";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { i10n } from "../../../config/prime-locale";

type AccountBalanceProp = {
  year: number,
  currency: string
}

type AccountBalance = {
  account: Account,
  startBalance: number,
  endBalance: number
}

const AccountBalanceComponent = ({ year, currency }: AccountBalanceProp) => {
  const [accounts, setAccounts] = React.useState<AccountBalance[] | undefined>()

  useEffect(() => {
    AccountRepository.own()
      .then(async (account: Account[]) => {
        const accounts = await Promise.all(account.map(async account => {
          const startBalance = (await StatisticalRepository.balance({
            accounts: [account],
            currency: currency,
            allMoney: true,
            onlyIncome: false,
            dateRange: {
              start: '1970-01-01',
              end: `${ year }-01-01`
            }
          })).balance
          const endBalance = (await StatisticalRepository.balance({
            accounts: [account],
            allMoney: true,
            onlyIncome: false,
            currency: currency,
            dateRange: {
              start: '1970-01-01',
              end: `${ year + 1 }-01-01`
            }
          })).balance

          return {
            account,
            startBalance,
            endBalance
          }
        }))
        setAccounts(accounts)
      }).catch(console.error)
  }, [currency, year])

  return <>
    <DataTable value={ accounts } size='small' loading={ !accounts }>
      <Column header={ i10n('Account.name') } field='account.name' headerClassName='!bg-[unset]'/>
      <Column header={ i10n('page.reports.default.startBalance') }
              headerClassName='!bg-[unset]'
              className='!text-right'
              body={ account => <MoneyComponent money={ account.startBalance } currency={ currency }/>}/>
      <Column header={ i10n('page.reports.default.endBalance') }
              headerClassName='!bg-[unset]'
              className='!text-right'
              body={ account => <MoneyComponent money={ account.endBalance } currency={ currency }/>}/>
      <Column header={ i10n('common.difference') }
              headerClassName='!bg-[unset]'
              className='font-bold opacity-70 text-right!'
              body={ account => <MoneyComponent money={ account.endBalance - account.startBalance } currency={ currency }/>}/>
    </DataTable>
  </>
}

export default AccountBalanceComponent
