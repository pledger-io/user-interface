import RestAPI from "./rest-api";
import { Budget, Identifier } from "../../types/types";

export type ComputedExpense = {
    spent: number
    left: number
    dailySpent: number
    dailyLeft: number
}


const BudgetRepository = (api => {
    return {
        firstBudget: (): Promise<string>                                            => api.get('budgets'),
        budgetMonth: (year: number, month: number): Promise<Budget>                 => api.get(`budgets?year=${year}&month=${month}`),
        create: (budget: any): Promise<Budget>                                      => api.put('budgets', budget),
        compute: (expenseId: Identifier, year: number, month: number): Promise<any> => api.get(`budgets/expenses/balance?expenseId=${expenseId}&year=${year}&month=${month}`),
        expense: (expense: any): Promise<Budget>                                    => api.patch('budgets/expenses', expense),
    }
})(RestAPI)

export default BudgetRepository