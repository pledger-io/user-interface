import PropTypes from 'prop-types';

import {Autocomplete} from "../Autocomplete";
import {AbstractInput} from "../input/AbstractInput";
import restAPI from "../../RestAPI";

export class BudgetInput extends Autocomplete {
    static propTypes = {
        ...AbstractInput.propTypes,
        value: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })
    }

    constructor(props, context) {
        super(props, context, token => restAPI.get(`budgets/auto-complete?token=${token}`));
    }

    renderInput(field, fieldContext) {
        const {options = [], resultSelected, selected = ''} = this.state
        const {value} = this.props
        if (selected === '' && value) {
            setTimeout(() => this.setState({
                selected: value.name
            }), 50)
        }

        return (
            <div className='BudgetInput'>
                <input type='text'
                       style={{width: '-webkit-max-content'}}
                       onKeyDown={event => this.onKeyDown(event)}
                       onKeyUp={event => this.onKeyUp(event)}
                       onChange={event => this.autocomplete(event)} value={selected}/>

                {options.length > 0 &&
                    <div className='AutoComplete'>
                        {options.map((budget, idx) =>
                            <div key={budget.id}
                                 className={`Result ${idx === resultSelected ? ' selected' : ''}`}
                                 onClick={() => this.select(budget)}>
                                {budget.name}
                                <div className='Summary'>{budget.description}</div>
                            </div>)}
                    </div>
                }
            </div>
        )
    }
}
