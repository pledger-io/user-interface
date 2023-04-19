import React from "react";
import {useAutocomplete} from "../Autocomplete";
import restAPI from "../../repositories/rest-api";
import {InputGroup} from "../input/InputGroup";
import {EntityShapes} from "../../../config";
import PropTypes from "prop-types";

const AccountAutocompleteRow = (account) => {
    return (
        <span>
            {account.name}
            <span className='iban'>{account.account.iban}</span>
            <div className='Summary'>{account.description}</div>
        </span>
    )
}

/**
 * The account input is used for autocompletion input for both 'debit' and 'credit' type transactions.
 */
export const AccountInput = (props) => {
    return useAutocomplete({
            autoCompleteCallback: value => restAPI.get(`accounts/auto-complete?type=${props.type}&token=${value}`),
            entityRender: AccountAutocompleteRow,
            entityLabel: account => account?.name
        },
        props)
}
AccountInput.propTypes = {
    ...InputGroup.propTypes,
    value: EntityShapes.Account,
    type: PropTypes.string
}
