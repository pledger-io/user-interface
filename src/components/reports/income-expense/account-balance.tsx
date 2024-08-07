import React, { useEffect } from "react";
import { Account } from "../../../types/types";
import AccountRepository from "../../../core/repositories/account-repository";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import MoneyComponent from "../../format/money.component";

import Loading from "../../layout/loading.component";
import Translation from "../../localization/translation.component";

type AccountBalanceProp = {
    year: number,
    currency: string
}

type AccountBalance = {
    account: Account,
    startBalance: number,
    endBalance: number
}

const AccountBalanceComponent = ({ year, currency } : AccountBalanceProp) => {
    const [accounts, setAccounts] = React.useState<AccountBalance[] | undefined>()

    useEffect(() => {
        AccountRepository.own()
            .then(async (account : Account[]) => {
                const accounts = await Promise.all(account.map(async account => {
                    const startBalance = (await StatisticalRepository.balance({
                        accounts: [account],
                        currency: currency,
                        allMoney: true,
                        onlyIncome: false,
                        dateRange: {
                            start: '1970-01-01',
                            end: `${year}-01-01`
                        }
                    })).balance
                    const endBalance = (await StatisticalRepository.balance({
                        accounts: [account],
                        allMoney: true,
                        onlyIncome: false,
                        currency: currency,
                        dateRange: {
                            start: '1970-01-01',
                            end: `${year + 1}-01-01`
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

    return <table className='Table'>
        <thead>
        <tr>
            <th><Translation label='Account.name'/></th>
            <th><Translation label='page.reports.default.startBalance'/></th>
            <th><Translation label='page.reports.default.endBalance'/></th>
            <th><Translation label='common.difference'/></th>
        </tr>
        </thead>
        <tbody>
        { !accounts && <tr>
            <td colSpan={ 4 }><Loading/></td>
        </tr> }

        { accounts && accounts.length === 0 && <tr>
            <td colSpan={ 4 }><Translation label='common.results.nodata'/></td>
        </tr> }

        { accounts?.map(account =>
            <tr key={ account.account.id }>
                <td>{ account.account.name }</td>
                <td><MoneyComponent money={ account.startBalance } currency={ currency }/></td>
                <td><MoneyComponent money={ account.endBalance } currency={ currency }/></td>
                <td><MoneyComponent money={ account.endBalance - account.startBalance } currency={ currency }/></td>
            </tr>)
        }
        </tbody>
    </table>
}

export default AccountBalanceComponent