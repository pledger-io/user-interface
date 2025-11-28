import { mdiHelpCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "primereact/button";
import React from "react";
import { i10n } from "../../../config/prime-locale";
import { Account } from "../../../types/types";
import BalanceComponent from "../../balance.component";
import MoneyComponent from "../../format/money.component";

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
          { i10n('page.accounts.saving.amount.current') }
          <Button text
                  icon={ () => <Icon path={ mdiHelpCircleOutline } size={ 1 }/> }
                  tooltip={ i10n('page.accounts.saving.amount.current.help') }/>
        </td>
        <td className='pl-3'><BalanceComponent accounts={ [savingAccount.id] }/></td>
      </tr>
      <tr>
        <td className='flex gap-5 justify-between font-bold items-center'>
          { i10n('page.accounts.saving.amount.required') }
          <Button text
                  icon={ () => <Icon path={ mdiHelpCircleOutline } size={ 1 }/> }
                  tooltip={ i10n('page.accounts.saving.amount.required.help') }/>
        </td>
        <td className='pl-3'><MoneyComponent money={ requiredSavings }
                                             currency={ savingAccount.account.currency }/></td>
      </tr>
      <tr>
        <td className='flex gap-5 justify-between font-bold items-center'>
          { i10n('page.account.saving.suggestedSaving') }
          <Button text
                  icon={ () => <Icon path={ mdiHelpCircleOutline } size={ 1 }/> }
                  tooltip={ i10n('page.account.saving.suggestedSaving.help') }/>
        </td>
        <td className='pl-3'><MoneyComponent money={ suggestedMonthlySaving }
                                             currency={ savingAccount.account.currency }/></td>
      </tr>
      </tbody>
    </table>
  </>
}

export default SavingSummaryComponent
