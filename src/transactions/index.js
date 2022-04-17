import {Route} from "react-router-dom";
import React from "react";

import {withNavigation, withPathParams} from "../core/hooks";

import {ScheduledTransactionOverview} from "./schedule/ScheduledTransactionOverview";
import {ScheduleTransactionForm} from "./schedule/ScheduleTransactionForm";

const ScheduledTransactionEditForm = withNavigation(withPathParams(ScheduleTransactionForm))

export const TransactionRoutes = [
    <Route key='schedule-transaction-overview' path='/automation/schedule/transactions' element={<ScheduledTransactionOverview />}/>,
    <Route key='schedule-transaction-edit' path='/automation/schedule/transactions/:id/edit' element={<ScheduledTransactionEditForm />}/>,

]
