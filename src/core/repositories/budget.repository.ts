import RestAPI from "./rest-api";
import {Budget} from "../types";

const BudgetRepository = (api => {
    return {
        firstBudget: (): Promise<string>                             => api.get('budgets'),
        budgetMonth: (year: number, month: number): Promise<Budget>  => api.get(`budgets/${year}/${month}`),
        create: (budget: any): Promise<Budget>                       => api.put('budgets', budget),
    }
})(RestAPI)

export default BudgetRepository