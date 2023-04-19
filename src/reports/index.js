import {Route} from "react-router-dom";
import Dashboard from "./dashboard";
import {IncomeExpenseView} from "./IncomeExpenseView";
import CategoryReportView from "./category-monthly";
import {BudgetReportView} from "./budget-monthly";

export const ReportRoutes = [
    <Route key='dashboard-report' path='/dashboard' element={<Dashboard />}/>,
    <Route key='income-expense-report' path='/reports/income-expense' element={<IncomeExpenseView />}/>,
    <Route key='income-expense-year-report' path='/reports/income-expense/:year/:currency' element={<IncomeExpenseView />}/>,

    <Route key='category-report' path='/reports/monthly-category' element={<CategoryReportView />}/>,
    <Route key='category-year-report' path='/reports/monthly-category/:year/:currency' element={<CategoryReportView />}/>,

    <Route key='budget-report' path='/reports/monthly-budget' element={<BudgetReportView />}/>,
    <Route key='budget-year-report' path='/reports/monthly-budget/:year/:currency' element={<BudgetReportView />}/>,
]
