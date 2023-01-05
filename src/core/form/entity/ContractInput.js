import PropTypes from 'prop-types';

import restAPI from "../../RestAPI";

import {useAutocomplete} from "../Autocomplete";
import {InputGroup} from "../input/AbstractInput";

const ContractAutocompleteRow = contract => {
    return (
        <span>
            {contract.name}
            <div className='Summary'>{contract.description}</div>
        </span>
    )
}

export const ContractInput = props => {
    return useAutocomplete({
        autoCompleteCallback: value => restAPI.get(`contracts/auto-complete?token=${value}`),
        entityLabel: contract => contract?.name,
        entityRender: ContractAutocompleteRow
    }, props)
}
ContractInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    })
}
