import PropTypes from 'prop-types';

import { useAutocomplete } from "../Autocomplete";
import { InputGroup } from "../input/InputGroup";
import restApi from "../../../core/repositories/rest-api";

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
        autoCompleteCallback: value => restApi.get(`contracts/auto-complete?token=${value}`),
        entityLabel: contract => contract?.name,
        entityRender: ContractAutocompleteRow
    }, props)
}
ContractInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func
}
