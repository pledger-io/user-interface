import { Attributes } from "react";
import { Contract } from "../../../core/types";

import { useAutocomplete } from "../Autocomplete";
import { FieldType } from "../form-types";
import restApi from "../../../core/repositories/rest-api";

const ContractAutocompleteRow = (contract: Contract) => {
    return (
        <span>
            {contract.name}
            <div className='Summary'>{contract.description}</div>
        </span>
    )
}

type ContractInputProps = FieldType & Attributes & {
    onChange?: (_: Contract) => void
}

export const ContractInput = (props: ContractInputProps) => {
    return useAutocomplete<Contract>({
        autoCompleteCallback: value => restApi.get(`contracts/auto-complete?token=${value}`),
        entityLabel: (contract: Contract) => contract?.name,
        entityRender: ContractAutocompleteRow
    }, props)
}
