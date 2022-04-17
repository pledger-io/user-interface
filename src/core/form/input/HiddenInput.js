import React from "react";

import {FormContext} from "../Form";

/**
 * The hidden input component will add a field to the form that is not visible to the user.
 */
export class HiddenInput extends React.Component {
    static contextType = FormContext

    constructor(props, context) {
        super(props, context);

        this.context.addField({
            field: props,
            value: props.value
        })
    }

    render() {
        const {value, id} = this.props
        return <input type='hidden' id={id} name={id} value={value}/>
    }
}
