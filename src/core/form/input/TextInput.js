import PropTypes from 'prop-types';

import {AbstractInput} from "./AbstractInput";

export class TextInput extends AbstractInput {
    static propTypes = {
        ...AbstractInput.propTypes,
        // Indicator if the field is in read only mode
        readonly: PropTypes.bool,
        // The type of input to use, can be any of text | number | password
        type: PropTypes.oneOf(['number', 'text', 'password']),
        // Any pattern validation that should be applied
        pattern: PropTypes.string,
        // Any minimum value validation, only valid for type = 'number'
        min: PropTypes.number,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
    }

    renderInput(field, formContext) {
        const {required, type, pattern, readonly, minLength, maxLength, onChange = value => {}} = this.props
        const value = field.value || this.props.value || '';

        return <input id={field.id}
                      name={field.id}
                      value={field && value}
                      required={required}
                      pattern={pattern}
                      readOnly={readonly}
                      onChange={e => formContext.onChange(e, field) && onChange(e.currentTarget.value)}
                      minLength={minLength}
                      maxLength={maxLength}
                      type={type}/>
    }
}
