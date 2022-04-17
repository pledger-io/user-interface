import {Route} from "react-router-dom";
import {DashboardView} from "./DashboardView";
import {IncomeExpenseView} from "./IncomeExpenseView";

export const ReportRoutes = [
    <Route key='dashboard-report' path='/dashboard' element={<DashboardView />}/>,
    <Route key='income-expense-report' path='/reports/income-expense' element={<IncomeExpenseView />}/>,
    <Route key='income-expense-year-report' path='/reports/income-expense/:year/:currency' element={<IncomeExpenseView />}/>,
]
