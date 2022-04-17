import React from "react";

import {Button} from "../../Button";
import {FormContext} from "../Form";

/**
 * The submit button component allows for forms to be submitted to the
 * `onSubmit` handler of the form.
 */
export class SubmitButton extends React.Component {
    static contextType = FormContext

    render() {
        const {errors} = this.context

        let hasErrors = false
        for (let field in errors) {
            hasErrors = hasErrors || errors[field].length > 0
        }

        return <Button {...this.props}
                       disabled={hasErrors}
                       variant='primary'
                       type='submit'/>
    }
}
