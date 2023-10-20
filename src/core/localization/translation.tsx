import {FC, useEffect, useState} from "react";
import LocalizationService from "./localization-service";


type TranslationProps = {
    label: string
    className?: string
}

/**
 * The translation component is able to display a localized message on the screen using a given translation
 * key.
 */
const Translation: FC<TranslationProps> = ({label, className = ''}) => {
    const [localized, setLocalized] = useState(`!Not translated! [${label}]`)

    useEffect(() => {
        LocalizationService.get(label).then(setLocalized)
    }, [label]);

    return <span className={ `Translation ${className}` }>
        { localized }
    </span>
}

export default Translation