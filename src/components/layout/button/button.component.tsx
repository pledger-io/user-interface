import Icon from "@mdi/react";
import React from "react";

import { Button, ButtonProps } from "primereact/button";
import { i10n } from "../../../config/prime-locale";

const _ = (props: ButtonProps) => {

  let className = props.className || ''
  if (!props.label) {
    className += ' icon-only'
  }
  const label = props.label ? i10n(props.label) : ' '
  return <Button { ...props }
                 label={ label as string }
                 className={ `flex gap-1 items-center justify-center ${ className }` }
                 icon={ () => <Icon path={ props.icon as any } size={ 1 }/> }/>
}

export default _;
