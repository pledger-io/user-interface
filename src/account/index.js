import React, {useState} from "react";
import {Navigate, Route} from "react-router-dom";
import {withPathParams, withQueryContext} from "../core/hooks";

import {LiabilityOverview} from "./liability/LiabilityOverview";
import {OwnAccountOverview} from "./OwnAccountOverview";
import {AccountForm} from "./AccountForm";
import {AccountOverview} from "./AccountOverview";

import '../assets/css/Account.scss'
import {LiabilityForm} from "./liability/LiabilityForm";
import {AccountTransactionOverview} from "./AccountTransactionOverview";
import {LiabilityView} from "./liability/LiabilityView";
import {TransactionForm} from "./transaction/TransactionForm";

const ExpenseOverview = withQueryContext(AccountOverview)
const RevenueOverview = withQueryContext(AccountOverview)
const LiabilityOverviewWithContext = withQueryContext(LiabilityOverview)

const OwnAccountEdit = withPathParams(AccountForm)
const ExpenseAccountEdit = withPathParams(AccountForm)
const RevenueAccountEdit = withPathParams(AccountForm)
const LiabilityEdit = withPathParams(LiabilityForm)

const RedirectLiability = withPathParams(props => {
    const [path, setPath] = useState(null)
    props.pathContext.resolved = ({id}) => setPath('/accounts/liability/' + id)

    if (path != null) {
        return <Navigate to={path} />
    }

    return ''
})


export const AccountRoutes = [
    <Route key='own-account' path='/accounts/own' element={<OwnAccountOverview/>}/>,
    <Route key='debit-overview' path='/accounts/revenue' element={<RevenueOverview type='debtor'/>}/>,
    <Route key='credit-overview' path='/accounts/expense' element={<ExpenseOverview type='creditor'/>}/>,
    <Route key='liability-overview' path='/accounts/liability' element={<LiabilityOverviewWithContext />}/>,

    <Route key='account-edit' path='/accounts/own/:id/edit' element={<OwnAccountEdit type='accounts' />}/>,
    <Route key='expense-edit' path='/accounts/expense/:id/edit' element={<ExpenseAccountEdit type='creditor' />}/>,
    <Route key='revenue-edit' path='/accounts/revenue/:id/edit' element={<RevenueAccountEdit type='debtor' />}/>,
    <Route key='liability-edit' path='/accounts/liability/:id/edit' element={<LiabilityEdit />}/>,

    <Route key='account-new' path='/accounts/own/add' element={<OwnAccountEdit type='accounts' />}/>,
    <Route key='expense-new' path='/accounts/expense/add' element={<ExpenseAccountEdit type='creditor' />}/>,
    <Route key='revenue-new' path='/accounts/revenue/add' element={<RevenueAccountEdit type='debtor' />}/>,
    <Route key='liability-new' path='/accounts/liability/add' element={<LiabilityEdit />}/>,

    <Route key='account-transaction-overview' path='/accounts/:type/:id/transactions' element={<AccountTransactionOverview />}/>,
    <Route key='account-month-transaction-overview' path='/accounts/:type/:id/transactions/:year/:month' element={<AccountTransactionOverview />}/>,

    <Route key='account-transaction-add' path='/accounts/:type/:id/transactions/add/:transactionType' element={<TransactionForm />}/>,
    <Route key='account-transaction-edit' path='/accounts/:type/:id/transaction/:transactionId/edit' element={<TransactionForm />}/>,

    <Route key='liability-transaction-overview' path='/accounts/liability/:id' element={<LiabilityView />}/>,
    <Route key='liability-transaction-redirect' path='/accounts/liability/:id/transactions' element={<RedirectLiability/>} />

]
