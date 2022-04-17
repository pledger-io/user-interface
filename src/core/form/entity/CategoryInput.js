import PropTypes from 'prop-types';

import {AbstractInput} from "../input/AbstractInput";
import {Autocomplete} from "../Autocomplete";
import restAPI from "../../RestAPI";

export class CategoryInput extends Autocomplete {
    static propTypes = {
        ...AbstractInput.propTypes,
        value: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })
    }

    constructor(props, context) {
        super(props, context, token => this.fetchAutocomplete(token))
    }

    fetchAutocomplete(token) {
        return new Promise((resolve, failed) => {
            restAPI.get(`categories/auto-complete?token=${token}`)
                .then(categories => resolve(categories.map(category => {
                    return {
                        id: category.id,
                        name: category.label,
                        description: category.description
                    }
                })))
                .catch(failed)
        })
    }

    renderInput(field, fieldContext) {
        const {options = [], selected = '', resultSelected} = this.state
        const {value} = this.props
        if (selected === '' && value) {
            setTimeout(() => this.setState({
                selected: value.name
            }), 50)
        }

        return (
            <div className='CategoryInput'>
                <input type='text'
                       style={{width: '-webkit-max-content'}}
                       onKeyDown={event => this.onKeyDown(event)}
                       onKeyUp={event => this.onKeyUp(event)}
                       onChange={event => this.autocomplete(event)} value={selected}/>

                {options.length > 0 &&
                    <div className='AutoComplete'>
                        {options.map((category, idx) =>
                            <div key={category.id}
                                 className={`Result ${idx === resultSelected ? ' selected' : ''}`}
                                 onClick={() => this.select(category)}>
                                {category.name}
                                <div className='Summary'>{category.description}</div>
                            </div>)}
                    </div>
                }
            </div>
        )
    }
}
