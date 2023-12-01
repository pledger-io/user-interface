import RestAPI from "./rest-api";
import {Budget, Identifier} from "../types";

const BudgetRepository = (api => {
    return {
        firstBudget: (): Promise<string>                                            => api.get('budgets'),
        budgetMonth: (year: number, month: number): Promise<Budget>                 => api.get(`budgets/${year}/${month}`),
        create: (budget: any): Promise<Budget>                                      => api.put('budgets', budget),
        compute: (expenseId: Identifier, year: number, month: number): Promise<any> => api.get(`budgets/expenses/${expenseId}/${year}/${month}`),
    }
})(RestAPI)

export default BudgetRepository