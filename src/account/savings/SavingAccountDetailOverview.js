import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Dialog,
    Dropdown,
    Formats,
    Layout,
    Notifications,
    Pagination,
    Progressbar,
    Resolver,
    Statistical,
    Translations
} from "../../core";
import React, {useEffect, useState} from "react";
import {EntityShapes} from "../../config";
import {useNavigate, useParams} from "react-router-dom";
import SavingsRepository from "../../core/repositories/savings-repository";
import AccountRepository from "../../core/repositories/account-repository";

import {
    mdiContentSave,
    mdiDotsVertical,
    mdiPencilBoxOutline,
    mdiPiggyBankOutline,
    mdiPlusBox,
    mdiSwapHorizontal,
    mdiTrashCanOutline
} from "@mdi/js";
import {Form, Input, SubmitButton} from "../../core/form";

import '../../assets/css/SavingAccountView.scss'
import {useDateRange, useQueryParam} from "../../core/hooks";
import {TransactionTable} from "../../transactions/TransactionTable";

const SavingSummaryComponent = ({savingAccount}) => {
    if (!savingAccount) return <Layout.Loading />

    const requiredSavings = (savingAccount?.savingGoals || [])
            .map(s => s.reserved)
            .reduce((previous, current) => previous + current, 0)
    const suggestedMonthlySaving = (savingAccount?.savingGoals || [])
            .map(savingGoal => (savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft)
            .reduce((previous, current) => previous + current, 0)

    return <>
        <h2>{savingAccount.name}</h2>
        <div className='text-muted'>{savingAccount.description}</div>

        <table className='Summary'>
            <tr>
                <td>
                    <Translations.Translation label='page.accounts.saving.amount.current' />
                    <Translations.HelpTranslation label='page.accounts.saving.amount.current.help'/>
                </td>
                <td><Statistical.Balance accounts={[savingAccount]}/></td>
            </tr>
            <tr>
                <td>
                    <Translations.Translation label='page.accounts.saving.amount.required' />
                    <Translations.HelpTranslation label='page.accounts.saving.amount.required.help'/>
                </td>
                <td><Formats.Money money={requiredSavings} currency={savingAccount.account.currency}/></td>
            </tr>
            <tr>
                <td>
                    <Translations.Translation label='page.account.saving.suggestedSaving' />
                    <Translations.HelpTranslation label='page.account.saving.suggestedSaving.help'/>
                </td>
                <td><Formats.Money money={suggestedMonthlySaving} currency={savingAccount.account.currency}/></td>
            </tr>
        </table>
    </>
}
SavingSummaryComponent.propTypes = {
    savingAccount: EntityShapes.Account
}

const ReserveToGoalComponent = ({account, savingGoal, onChanged = _ => {}}) => {
    const control = {
        close: () => undefined
    }

    const onSubmit = e => SavingsRepository.assign(account.id, savingGoal.id, e.amount)
        .then(updatedAccount => onChanged(updatedAccount))
        .then(control.close)

    return <>
        <Form onSubmit={onSubmit} entity='SavingGoal'>
            <Dialog.Dialog className='AddToSavings'
                           title='dialog.savings.assign.to.goal'
                           control={control}
                           actions={[
                               <SubmitButton label='dialog.savings.assign.action'
                                               icon={mdiPlusBox}
                                               variant='success'
                                               key='addToSavingGoal'/>
                           ]}
                           openButton={<Buttons.Button icon={mdiPlusBox}
                                                       variant='icon'/>}>
                <Input.Text id='amount'
                            type='number'
                            required={true}
                            min={0} />
            </Dialog.Dialog>
        </Form>
    </>
}

const SavingGoalTableComponent = ({account, savingGoals = [], currency = 'EUR'}) => {
    const [goals, setGoals] = useState(savingGoals)
    useEffect(() => {
        setGoals(savingGoals)
    }, [savingGoals])

    const onUpdated = updatedAccount => setGoals(updatedAccount.savingGoals)
    const onDelete = toDelete => SavingsRepository.delete(account.id, toDelete.id)
            .then(() => Notifications.Service.success('page.account.saving.goal.ended'))
            .then(() => setGoals(goals.filter(goal => goal.id !== toDelete.id)))
            .catch(() => Notifications.Service.warning('page.account.saving.goal.endingFail'))

    if (!account) return <Layout.Loading />
    return <>
        <table className='Table SavingGoals'>
            <thead>
            <tr>
                <th><Translations.Translation label='SavingGoal.goal'/></th>
                <th><Translations.Translation label='page.account.saving.soFar'/></th>
                <th><Translations.Translation label='SavingGoal.goal'/></th>
                <th><Translations.Translation label='page.account.saving.remaining'/></th>
                <th><Translations.Translation label='page.account.saving.suggestedSaving'/></th>
                <th />
            </tr>
            </thead>
            <tbody>
            {!goals.length && <tr><td colSpan="5" style={{textAlign: 'center'}}><Translations.Translation label="common.overview.noresults"/></td></tr>}

            {goals.map(savingGoal => <tr key={savingGoal.id}>
                <td>{savingGoal.name}</td>
                <td>
                    <Progressbar total={savingGoal.goal} current={savingGoal.reserved} />
                    <ReserveToGoalComponent savingGoal={savingGoal}
                                            onChanged={onUpdated}
                                            account={account} />
                </td>
                <td><Formats.Money money={savingGoal.goal} currency={currency}/></td>
                <td><Formats.Money money={savingGoal.goal - savingGoal.reserved} currency={currency}/></td>
                <td><Formats.Money money={(savingGoal.goal - savingGoal.reserved) / savingGoal.monthsLeft} currency={currency}/></td>
                <td>
                    <Dropdown.Dropdown icon={mdiDotsVertical}>
                        <EditSavingGoalComponent accountId={account.id}
                                                 openButton={<Buttons.Button label='page.account.saving.update'
                                                                             icon={mdiPencilBoxOutline}
                                                                             variant='primary'/>}
                                                 savingGoal={savingGoal}
                                                 currency={account.account.currency}
                                                 onChanged={onUpdated}/>

                        <Dialog.ConfirmPopup title='page.account.saving.stop'
                                             openButton={<Buttons.Button label='page.account.saving.stop'
                                                                         icon={mdiTrashCanOutline}
                                                                         variant='warning'/>}
                                             onConfirm={() => onDelete(savingGoal)}>
                            <Translations.Translation label='page.account.saving.stop.message'/>
                        </Dialog.ConfirmPopup>
                    </Dropdown.Dropdown>
                </td>
            </tr>)}
            </tbody>
        </table>

        <EditSavingGoalComponent accountId={account.id}
                                 openButton={<Buttons.Button label='page.account.savings.new' icon={mdiPiggyBankOutline} />}
                                 currency={account.account.currency}
                                 onChanged={onUpdated}/>
    </>
}

const EditSavingGoalComponent = ({accountId, currency = 'EUR', savingGoal = null, onChanged = _ => {}, openButton = null}) => {
    const control = {
        close: () => undefined
    }
    const onSubmit = entity => {
        if (savingGoal) {
            SavingsRepository.update(accountId, savingGoal.id, entity)
                .then(updatedAccount => onChanged(updatedAccount))
                .then(control.close)
        } else {
            SavingsRepository.create(accountId, entity)
                .then(updatedAccount => onChanged(updatedAccount))
                .then(control.close)
        }
    }

    return <>
        <Form onSubmit={onSubmit} entity='SavingGoal'>
            <Dialog.Dialog title='page.account.savings.new'
                           className='Large'
                           control={control}
                           actions={[
                               <SubmitButton icon={mdiContentSave}
                                             label='common.action.save' />
                           ]}
                           openButton={openButton}>
                <Input.Text id='name'
                            required={true}
                            value={savingGoal?.name}
                            title='SavingGoal.name' />
                <Input.Amount id='goal'
                              currency={currency}
                              value={savingGoal?.goal}
                              required={true}
                              title='SavingGoal.goal' />

                <Input.Date id='targetDate'
                            required={true}
                            value={savingGoal?.targetDate}
                            title='SavingGoal.targetDate' />
            </Dialog.Dialog>
        </Form>
    </>
}

const SavingMonthlyTransactionComponent = ({account}) => {
    const [range]                            = useDateRange()
    const [page]                             = useQueryParam('page', "1")
    const [pagination, setPagination]        = useState({})
    const [transactions, setTransactions]    = useState(undefined)

    useEffect(() => {
        setTransactions(undefined)
        AccountRepository.transactions(account.id, range, parseInt(page))
            .then(results => setTransactions(results.content) || setPagination(results.info))
    }, [range, page, account])

    return <div className='TransactionOverview'>
        <div className="BalanceButtons">
            <Buttons.Button label='page.transactions.transfer.add'
                            href={`${Resolver.Account.resolveUrl(account)}/transactions/add/transfer`}
                            className={Resolver.Account.isManaged(account) ? 'Hidden' : ''}
                            variant='primary'
                            icon={mdiSwapHorizontal}/>
        </div>
        <TransactionTable account={account} transactions={transactions}/>

        <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                              pageSize={pagination.pageSize}/>
    </div>
}

const SavingAccountDetailOverview = () => {
    const [account, setAccount] = useState()
    const {id}                  = useParams()
    const navigate              = useNavigate()
    const [range]               = useDateRange()

    useEffect(() => {
        AccountRepository.get(id)
            .then(setAccount)
    }, [id])

    const onDateChange = ({year, month}) => navigate(`/accounts/savings/${id}/transactions/${year}/${month}`)

    if (!account) return <Layout.Loading />
    return <>
        <div className='SavingDetailView'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.savings'/>
                <BreadCrumbItem message={account?.name}/>

                <BreadCrumbMenu>
                    <Dropdown.YearMonth
                        onChange={onDateChange}
                        selected={{month: range.month(), year: range.year()}} />
                </BreadCrumbMenu>
            </BreadCrumbs>

            <Layout.Card title='page.account.savings.goals'>
                <SavingSummaryComponent savingAccount={account} />

                <hr />

                <SavingGoalTableComponent savingGoals={account?.savingGoals} account={account} currency={account?.account?.currency} />
            </Layout.Card>

            <Layout.Card title='page.account.savings.transactions'>
                <SavingMonthlyTransactionComponent account={account}/>
            </Layout.Card>
        </div>
    </>
}

export default SavingAccountDetailOverview
