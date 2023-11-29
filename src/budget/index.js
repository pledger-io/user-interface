import {Route} from "react-router-dom";
import React from "react";
import BudgetOverview from "./overview/budget.overview";
import CreateBudgetView from "./create/create.view";

export const BudgetRoutes = [
    <Route key='overview' path='/budgets' element={<BudgetOverview />}/>,

    <Route key='create' path='/budgets/first-setup' element={<CreateBudgetView />}/>,
]