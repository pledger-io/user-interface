import PropTypes from 'prop-types';

import restAPI from "../../RestAPI";

import {Autocomplete} from "../Autocomplete";
import {AbstractInput} from "../input/AbstractInput";

export class ContractInput extends Autocomplete {
    static propTypes = {
        ...AbstractInput.propTypes,
        value: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })
    }

    constructor(props, context) {
        super(props, context, token => restAPI.get(`contracts/auto-complete?token=${token}`));
    }

    renderInput(field, fieldContext) {
        const {options = [], selected, resultSelected} = this.state
        const {value} = this.props
        if (selected === '' && value) {
            setTimeout(() => this.setState({
                selected: value.name
            }), 50)
        }

        return (
            <div className='ContractInput'>
                <input type='text'
                       style={{width: '-webkit-max-content'}}
                       onKeyDown={event => this.onKeyDown(event)}
                       onKeyUp={event => this.onKeyUp(event)}
                       onChange={event => this.autocomplete(event)} value={selected}/>

                {options.length > 0 &&
                    <div className='AutoComplete'>
                        {options.map((contract, idx) =>
                            <div key={contract.id}
                                 className={`Result ${idx === resultSelected ? ' selected' : ''}`}
                                 onClick={() => this.select(contract)}>
                                {contract.name}
                                <div className='Summary'>{contract.description}</div>
                            </div>)}
                    </div>
                }
            </div>
        )
    }
}
