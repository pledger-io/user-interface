import PropTypes from 'prop-types';

import {InputGroup} from "../input/InputGroup";
import {useAutocomplete} from "../Autocomplete";
import restAPI from "../../repositories/rest-api";

const CategoryAutocompleteRow = category => {
    return (
        <span>
            {category.name}
            <div className='Summary'>{category.description}</div>
        </span>
    )
}

export const CategoryInput = props => {
    return useAutocomplete({
        autoCompleteCallback: value => restAPI.get(`categories/auto-complete?token=${value}`)
            .then(categories => categories.map(c => {
                return {
                    id: c.id,
                    name: c.label,
                    description: c.description
                }
            })),
        entityLabel: category => category?.name,
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
