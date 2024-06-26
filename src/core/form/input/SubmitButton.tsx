import { FC, useContext } from "react";

import { Button } from "../../../components/layout/button";
import { FormContext } from "../Form";
import { ButtonProps } from "../../../components/layout/button/button.component";

type SubmitButtonProps = ButtonProps

/**
 * The submit button component allows for forms to be submitted to the
 * `onSubmit` handler of the form.
 */
export const SubmitButton: FC<SubmitButtonProps> = (props) => {
    const formContext = useContext(FormContext)

    const hasErrors = Object.values(formContext.errors)
        .filter(fieldErrors => fieldErrors.length > 0)
        .length > 0

    return <Button {...props}
                   disabled={hasErrors}
                   variant='primary'
                   type='submit'/>
}

