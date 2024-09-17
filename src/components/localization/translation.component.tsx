import { FC, useEffect, useState } from "react";
import LocalizationService from "../../service/localization.service";

type TranslationProps = {
    label: string
    className?: string,
    noHtml?: boolean
}

/**
 * The translation component is able to display a localized message on the screen using a given translation
 * key.
 */
const Translation: FC<TranslationProps> = ({ label, className = '', noHtml = false }) => {
    const [localized, setLocalized] = useState(`!Not translated! [${label}]`)

    useEffect(() => {
        LocalizationService.get(label).then(setLocalized)
    }, [label]);

    if (noHtml)
        return localized

    return <span className={ `Translation ${className}` } dangerouslySetInnerHTML={ { __html: localized } } />
}

export default Translation