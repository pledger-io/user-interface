import {useContext} from "react";

import {Button} from "../../Button";
import {FormContext} from "../Form";

/**
 * The submit button component allows for forms to be submitted to the
 * `onSubmit` handler of the form.
 */
export const SubmitButton = (props) => {
    const formContext = useContext(FormContext)

    const hasErrors = Object.values(formContext.errors)
        .filter(fieldErrors => fieldErrors.length > 0)
        .length > 0

    return <Button {...props}
                   disabled={hasErrors}
                   variant='primary'
                   type='submit'/>
}
SubmitButton.propTypes = Button.propTypes

