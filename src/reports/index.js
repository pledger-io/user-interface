import {Route} from "react-router-dom";
import {DashboardView} from "./DashboardView";
import {IncomeExpenseView} from "./IncomeExpenseView";
import {CategoryReportView} from "./CategoryReportView";
import {BudgetReportView} from "./BudgetReportView";

export const ReportRoutes = [
    <Route key='dashboard-report' path='/dashboard' element={<DashboardView />}/>,
    <Route key='income-expense-report' path='/reports/income-expense' element={<IncomeExpenseView />}/>,
    <Route key='income-expense-year-report' path='/reports/income-expense/:year/:currency' element={<IncomeExpenseView />}/>,

    <Route key='category-report' path='/reports/monthly-category' element={<CategoryReportView />}/>,
    <Route key='category-year-report' path='/reports/monthly-category/:year/:currency' element={<CategoryReportView />}/>,

    <Route key='budget-report' path='/reports/monthly-budget' element={<BudgetReportView />}/>,
    <Route key='budget-year-report' path='/reports/monthly-budget/:year/:currency' element={<BudgetReportView />}/>,
]
