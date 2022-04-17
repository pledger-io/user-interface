import {AbstractInput} from "./input/AbstractInput";

export class Autocomplete extends AbstractInput {
    static MIN_CHARS = 2;

    constructor(props, context, autoCompleteCallback = token => {}) {
        super(props, context);

        this.autoCompleteCallback = autoCompleteCallback
        this.state = {
            options : [],
            resultSelected: -1
        }
    }

    autocomplete(event) {
        const {currentTarget: {value}} = event

        this.setState({
            ...this.state,
            selected: value
        })
        if (value.length > Autocomplete.MIN_CHARS) {
            this.autoCompleteCallback(value)
                .then(options => this.setState({
                    options: options
                }))
        }
    }

    onKeyDown(event) {
        const {options} = this.state

        if (options.length > 0) {
            switch (event.key) {
                case 'Escape':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Enter':
                    event.preventDefault()
                    event.stopPropagation()
            }
        }
    }

    onKeyUp(event) {
        const {options, resultSelected} = this.state

        if (options.length > 0) {
            switch (event.key) {
                case 'Escape':
                    event.stopPropagation()
                    this.setState({
                        options: []
                    })
                    break
                case 'ArrowUp':
                    event.stopPropagation()
                    this.setState({
                        resultSelected: Math.max(0, resultSelected - 1)
                    })
                    break
                case 'ArrowDown':
                    event.stopPropagation()
                    this.setState({
                        resultSelected: Math.min(options.length, resultSelected + 1)
                    })
                    break
                case 'Enter':
                    event.stopPropagation()
                    this.select(options[resultSelected])
                    break
            }
        }
    }

    select(option) {
        const {id, onChange = value => {}} = this.props
        const field = this.context.fields[id] || {};

        onChange(option)
        this.context.onChange({persist: () => {}, currentTarget: {value: option}}, field);
        this.setState({
            options: [],
            selected: option.name
        })
    }
}
