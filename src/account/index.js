import React, {lazy, useState} from "react";
import {Navigate, Route} from "react-router-dom";
import {withPathParams, withQueryContext} from "../core/hooks";

import {AccountOverview} from "./AccountOverview";

import {TransactionForm} from "./transaction/TransactionForm";
import {LiabilityPaymentForm} from "./transaction/LiabilityPayment";
import '../assets/css/Account.scss'

const ExpenseOverview = withQueryContext(AccountOverview)
const RevenueOverview = withQueryContext(AccountOverview)

const RedirectLiability = withPathParams(props => {
    const [path, setPath] = useState(null)
    props.pathContext.resolved = ({id}) => setPath('/accounts/liability/' + id)

    if (path != null) {
        return <Navigate to={path} />
    }

    return ''
})


const OwnAccountOverview = lazy(() => import('./OwnAccountOverview'))

const AccountForm = lazy(() => import("./AccountForm"))
const AccountTransactionOverview = lazy(() => import("./AccountTransactionOverview"))

const LiabilityView = lazy(() => import('./liability/LiabilityView'))
const LiabilityOverview = lazy(() => import('./liability/LiabilityOverview'))
const LiabilityForm = lazy(() => import('./liability/LiabilityForm'))

export const AccountRoutes = [
    <Route key='own-account' path='/accounts/own' element={<OwnAccountOverview/>}/>,
    <Route key='debit-overview' path='/accounts/revenue' element={<RevenueOverview type='debtor'/>}/>,
    <Route key='credit-overview' path='/accounts/expense' element={<ExpenseOverview type='creditor'/>}/>,
    <Route key='liability-overview' path='/accounts/liability' element={<LiabilityOverview />}/>,

    <Route key='account-edit' path='/accounts/own/:id/edit' element={<AccountForm type='accounts' />}/>,
    <Route key='expense-edit' path='/accounts/expense/:id/edit' element={<AccountForm type='creditor' />}/>,
    <Route key='revenue-edit' path='/accounts/revenue/:id/edit' element={<AccountForm type='debtor' />}/>,
    <Route key='liability-edit' path='/accounts/liability/:id/edit' element={<LiabilityForm />}/>,

    <Route key='account-new' path='/accounts/own/add' element={<AccountForm type='accounts' />}/>,
    <Route key='expense-new' path='/accounts/expense/add' element={<AccountForm type='creditor' />}/>,
    <Route key='revenue-new' path='/accounts/revenue/add' element={<AccountForm type='debtor' />}/>,
    <Route key='liability-new' path='/accounts/liability/add' element={<LiabilityForm />}/>,

    <Route key='account-transaction-overview' path='/accounts/:type/:id/transactions' element={<AccountTransactionOverview />}/>,
    <Route key='account-month-transaction-overview' path='/accounts/:type/:id/transactions/:year/:month' element={<AccountTransactionOverview />}/>,

    <Route key='account-transaction-add' path='/accounts/:type/:id/transactions/add/:transactionType' element={<TransactionForm />}/>,
    <Route key='account-transaction-edit' path='/accounts/:type/:id/transaction/:transactionId/edit' element={<TransactionForm />}/>,

    <Route key='liability-transaction-overview' path='/accounts/liability/:id' element={<LiabilityView />}/>,
    <Route key='liability-transaction-redirect' path='/accounts/liability/:id/transactions' element={<RedirectLiability/>} />,
    <Route key='liability-transaction-add' path='/accounts/liability/:id/transactions/add' element={<LiabilityPaymentForm />}/>,
    <Route key='liability-transaction-edit' path='/accounts/liability/:id/transaction/:transactionId/edit' element={<LiabilityPaymentForm />}/>,

]
