import React from "react";

import {AbstractInput} from "./AbstractInput";

/**
 * The text area component will add an input text area on the form for the user to fill.
 */
export class TextArea extends AbstractInput {
    static propTypes = AbstractInput.propTypes

    renderInput(field, formContext) {
        const {required, onChange = value => {}} = this.props
        const value = field.value || this.props.value || '';

        return <textarea id={field.id}
                         name={field.id}
                         value={field && value}
                         required={required}
                         onChange={e => formContext.onChange(e, field) && onChange(e.currentTarget.value)}/>
    }
}
