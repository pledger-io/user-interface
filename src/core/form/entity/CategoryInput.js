import PropTypes from 'prop-types';

import {InputGroup} from "../input/InputGroup";
import {useAutocomplete} from "../Autocomplete";
import restAPI from "../../RestAPI";

const CategoryAutocompleteRow = category => {
    return (
        <span>
            {category.label}
            <div className='Summary'>{category.description}</div>
        </span>
    )
}

export const CategoryInput = props => {
    return useAutocomplete({
        autoCompleteCallback: value => restAPI.get(`categories/auto-complete?token=${value}`),
        entityLabel: category => category?.label,
        entityRender: CategoryAutocompleteRow
    }, props)
}
CategoryInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    })
}
