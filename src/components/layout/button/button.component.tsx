import Icon from "@mdi/react";
import React from "react";

import { Button, ButtonProps } from "primereact/button";
import { i10n } from "../../../config/prime-locale";

const _ = (props: ButtonProps) => {

    const label = props.label ? i10n(props.label) : null
    return <Button {...props}
                   label={ label }
                   className={`flex gap-1 items-center ${props.className}`}
                   icon={() => <Icon path={props.icon as any} size={ 1 } /> } />
}

export default _;
