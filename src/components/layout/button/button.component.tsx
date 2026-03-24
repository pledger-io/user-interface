import { Icon } from "@iconify-icon/react";
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
                 className={ `inline-flex gap-1 items-center justify-center ${ className }` }
                 icon={ () => <Icon icon={ props.icon as any } width='1.2em'/> }/>
}

export default _;
