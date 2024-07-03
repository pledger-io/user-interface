import React, { FC } from "react";
import { mdiHelpCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Translation from "./translation.component";

type HelpTranslationProps = {
    label: string,
    className?: string,
}

/**
 * The help translation is similar to the translation component, with one exception it displays a help icon
 * before the help text.
 */
const HelpComponent: FC<HelpTranslationProps> = ({ label, className = '' }) => {

    return <span className={ `HelpText ${className}` }>
        <Icon path={ mdiHelpCircleOutline }
              size={ .7 }/>
        <Translation label={ label }/>
    </span>
}

export default HelpComponent