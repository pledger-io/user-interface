import { Formats, Statistical, Translations } from "../../core";
import React from "react";
import { Account } from "../../core/types";

const SavingSummaryComponent = ({ savingAccount } : { savingAccount : Account }) => {
    const requiredSavings = (savingAccount?.savingGoals || [])
        .map(s => s.reserved)
        .reduce((previous, current) => previous + current, 0)
    const suggestedMonthlySaving = (savingAccount?.savingGoals || [])
        .map(savingGoal => (savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft)
        .reduce((previous, current) => previous + current, 0)

    return <>
        <h2 className='text-xl font-bold mb-2'>{savingAccount.name}</h2>
        <div className='text-muted'>{savingAccount.description}</div>

        <table className=''>
            <tbody>
            <tr>
                <td className='flex gap-5 justify-between font-bold items-center'>
                    <Translations.Translation label='page.accounts.saving.amount.current' />
                    <Translations.HelpTranslation label='page.accounts.saving.amount.current.help'/>
                </td>
                <td className='pl-3'><Statistical.Balance accounts={[savingAccount]}/></td>
            </tr>
            <tr>
                <td className='flex gap-5 justify-between font-bold items-center'>
                    <Translations.Translation label='page.accounts.saving.amount.required' />
                    <Translations.HelpTranslation label='page.accounts.saving.amount.required.help'/>
                </td>
                <td className='pl-3'><Formats.Money money={requiredSavings} currency={savingAccount.account.currency}/></td>
            </tr>
            <tr>
                <td className='flex gap-5 justify-between font-bold items-center'>
                    <Translations.Translation label='page.account.saving.suggestedSaving' />
                    <Translations.HelpTranslation label='page.account.saving.suggestedSaving.help'/>
                </td>
                <td className='pl-3'><Formats.Money money={suggestedMonthlySaving} currency={savingAccount.account.currency}/></td>
            </tr>
            </tbody>
        </table>
    </>
}

export default SavingSummaryComponent