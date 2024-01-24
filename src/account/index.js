import React, { useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { withPathParams } from "../core/hooks";

import TransactionForm from "./transaction/edit";
import { LiabilityPaymentForm } from "./transaction/LiabilityPayment";
import AccountTransactionOverview from "./detail-view"
import OwnAccountOverview from "./own-accounts"
import AccountOverview from "./AccountOverview"
import AccountForm from "./AccountForm"

import LiabilityForm from "./liability/liability-edit-page"
import LiabilityOverview from "./liability/LiabilityOverview";
import LiabilityView from "./liability/liability-detail-page";
import SavingDetailOverview from "./savings";

import '../assets/css/Account.scss'

const RedirectLiability = withPathParams(props => {
    const [path, setPath] = useState(null)
    props.pathContext.resolved = ({ id }) => setPath('/accounts/liability/' + id)

    if (path != null) {
        return <Navigate to={path} />
    }

    return ''
})

export const AccountRoutes = [
    <Route key='own-account' path='/accounts/own' element={<OwnAccountOverview/>}/>,
    <Route key='debit-overview' path='/accounts/revenue' element={<AccountOverview type='debtor'/>}/>,
    <Route key='credit-overview' path='/accounts/expense' element={<AccountOverview type='creditor'/>}/>,
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

    <Route key='savings-detail-view' path='/accounts/savings/:id/transactions' element={<SavingDetailOverview />}/>,
    <Route key='savings-detail-month-view' path='/accounts/savings/:id/transactions/:year/:month' element={<SavingDetailOverview />}/>,
]
