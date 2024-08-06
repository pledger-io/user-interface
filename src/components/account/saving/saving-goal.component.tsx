import React from "react";
import { Account } from "../../../types/types";
import BalanceComponent from "../../balance.component";
import MoneyComponent from "../../format/money.component";
import Translation from "../../localization/translation.component";
import HelpTranslation from "../../localization/help.component";

const SavingSummaryComponent = ({ savingAccount }: { savingAccount: Account }) => {
    const requiredSavings = (savingAccount?.savingGoals || [])
        .map(s => s.reserved)
        .reduce((previous, current) => previous + current, 0)
    const suggestedMonthlySaving = (savingAccount?.savingGoals || [])
        .map(savingGoal => (savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft)
        .reduce((previous, current) => previous + current, 0)

    return <>
        <h2 className='text-xl font-bold mb-2'>{ savingAccount.name }</h2>
        <div className='text-muted'>{ savingAccount.description }</div>

        <table className=''>
            <tbody>
            <tr>
                <td className='flex gap-5 justify-between font-bold items-center'>
                    <Translation label='page.accounts.saving.amount.current'/>
                    <HelpTranslation label='page.accounts.saving.amount.current.help'/>
                </td>
                <td className='pl-3'><BalanceComponent accounts={ [savingAccount] }/></td>
            </tr>
            <tr>
                <td className='flex gap-5 justify-between font-bold items-center'>
                    <Translation label='page.accounts.saving.amount.required'/>
                    <HelpTranslation label='page.accounts.saving.amount.required.help'/>
                </td>
                <td className='pl-3'><MoneyComponent money={ requiredSavings }
                                                    currency={ savingAccount.account.currency }/></td>
            </tr>
            <tr>
                <td className='flex gap-5 justify-between font-bold items-center'>
                    <Translation label='page.account.saving.suggestedSaving'/>
                    <HelpTranslation label='page.account.saving.suggestedSaving.help'/>
                </td>
                <td className='pl-3'><MoneyComponent money={ suggestedMonthlySaving }
                                                    currency={ savingAccount.account.currency }/></td>
            </tr>
            </tbody>
        </table>
    </>
}

export default SavingSummaryComponent