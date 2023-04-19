import PropTypes from 'prop-types';

import {useAutocomplete} from "../Autocomplete";
import {InputGroup} from "../input/InputGroup";
import restAPI from "../../repositories/rest-api";

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
        autoCompleteCallback: value => restAPI.get(`budgets/auto-complete?token=${value}`),
        entityLabel: budget => budget?.name,
        entityRender: BudgetAutocompleteRow
    }, props)
}
BudgetInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    })
}
