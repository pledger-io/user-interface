import { Route } from "react-router-dom";
import React from "react";

import { withNavigation, withPathParams } from "../core/hooks";

import { ScheduledTransactionOverview } from "./schedule/ScheduledTransactionOverview";
import { ScheduleTransactionForm } from "./schedule/ScheduleTransactionForm";
import GlobalTransactionView from "./global-view"

const ScheduledTransactionEditForm = withNavigation(withPathParams(ScheduleTransactionForm))

export const TransactionRoutes = [
    <Route key='schedule-transaction-overview' path='/automation/schedule/transactions' element={<ScheduledTransactionOverview />}/>,
    <Route key='schedule-transaction-edit' path='/automation/schedule/transactions/:id/edit' element={<ScheduledTransactionEditForm />}/>,

    <Route key='global-transaction-view-all' path='/transactions/income-expense' element={<GlobalTransactionView transfers={false}/>}/>,
    <Route key='global-transaction-view-all-ranged' path='/transactions/income-expense/:year/:month' element={<GlobalTransactionView transfers={false}/>}/>,

    <Route key='global-transaction-view' path='/transactions/transfers' element={<GlobalTransactionView transfers={true}/>}/>,
    <Route key='global-transaction-view-ranged' path='/transactions/transfers/:year/:month' element={<GlobalTransactionView transfers={true}/>}/>,

]
