import React from "react";
import PropTypes from 'prop-types';

import {AbstractInput} from "../input/AbstractInput";
import {Autocomplete} from "../Autocomplete";
import restAPI from "../../RestAPI";

/**
 * The account input is used for autocompletion input for both 'debit' and 'credit' type transactions.
 */
export class AccountInput extends Autocomplete {
    static propTypes = {
        ...AbstractInput.propTypes,
        type: PropTypes.oneOf(['debtor', 'creditor', 'own']),
        value: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })
    }

    constructor(props, context) {
        super(props, context, value => restAPI.get(`accounts/auto-complete?type=${props.type}&token=${value}`));
    }

    renderInput(field, fieldContext) {
        const {options = [], selected = '', resultSelected} = this.state
        if (selected === '' && this.props.value) {
            setTimeout(() => this.setState({
                selected: this.props.value.name
            }), 50)
        }

        return (
            <div className='AccountInput'>
                <input type='text'
                       style={{width: '-webkit-max-content'}}
                       onKeyDown={event => this.onKeyDown(event)}
                       onKeyUp={event => this.onKeyUp(event)}
                       onChange={event => this.autocomplete(event)} value={selected}/>
                {options.length > 0 &&
                    <div className='AutoComplete'>
                        {options.map((account, idx) =>
                            <div key={account.id}
                                 className={`Result ${idx === resultSelected ? ' selected' : ''}`}
                                 onClick={() => this.select(account)}>
                                {account.name}<span className='iban'>{account.account.iban}</span>
                                <div className='Summary'>{account.description}</div>
                            </div>)}
                    </div>
                }
            </div>
        )
    }
}
