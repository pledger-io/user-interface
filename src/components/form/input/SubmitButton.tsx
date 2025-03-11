import { FC, use } from "react";

import { Button } from "../../../components/layout/button";
import { FormContext } from "../Form";
import { ButtonProps } from "primereact/button";

/**
 * The submit button component allows for forms to be submitted to the
 * `onSubmit` handler of the form.
 */
export const SubmitButton: FC<ButtonProps> = (props) => {
    const formContext = use(FormContext)

    const hasErrors = Object.values(formContext.errors)
        .filter(fieldErrors => fieldErrors.length > 0)
        .length > 0

    return <Button { ...props }
                   disabled={ hasErrors }
                   severity='success'
                   type='submit'/>
}

