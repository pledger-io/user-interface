import React, {useEffect, useState} from "react";
import {mdiHelpCircleOutline} from "@mdi/js";
import Icon from "@mdi/react";
import PropTypes from "prop-types";
import {LocalizationRepository} from "./RestAPI";

class TranslationItem {
    constructor() {
        this.resolved = _ => void 0
        this.$ = new Promise(resolve => {
            this.resolved = function(localization) {
                resolve(localization);
            }
        })
    }
}

const TranslationService = (() => {
    const translations = new Map();

    const getOrCreate = key => {
        if (!translations.has(key)) translations.set(key, new TranslationItem())
        return translations.get(key)
    }
    const bulkUpdate = localization => Object.entries(localization)
            .forEach(([key, value]) => getOrCreate(key).resolved(value))

    const service = {
        load: language => LocalizationRepository.get(language).then(bulkUpdate),
        get: key => getOrCreate(key).$
    }

    service.load(localStorage.getItem('language') || 'en')

    return service
})()

/**
 * The translation component is able to display a localized message on the screen using a given translation
 * key.
 */
const Translation = ({label, className}) => {
    const [localized, setLocalized] = useState(`!Not translated! [${label}]`)

    useEffect(() => {
        TranslationService.get(label).then(setLocalized)
    }, [label])

    return <span className={`Translation ${className}`}>{localized}</span>
}
Translation.propTypes = {
    // The text key to locate the translated text by
    label: PropTypes.string.isRequired,
    className: PropTypes.string
}

/**
 * The help translation is similar to the translation component, with one exception it displays a help icon
 * before the help text.
 */
const HelpTranslation = ({ label, className = '' }) => {
    return (
        <span className={`HelpText ${className}`}>
            <Icon path={mdiHelpCircleOutline} size={.8}/>
            <Translation label={label}/>
        </span>
    )
}
HelpTranslation.propTypes = Translation.propTypes

export {
    Translation,
    HelpTranslation,
    TranslationService as LocalizationService
}
