import { useAutocomplete } from "../Autocomplete";
import restApi from "../../../core/repositories/rest-api";

const BudgetAutocompleteRow = budget => {
    return (
        <span>
            {budget.name}
            <div className='Summary'>{budget.description}</div>
        </span>
    )
}

export const BudgetInput = (props) => {
    return useAutocomplete({
        autoCompleteCallback: value => restApi.get(`budgets/auto-complete?token=${value}`),
        entityLabel: budget => budget?.name,
        entityRender: BudgetAutocompleteRow
    }, props)
}