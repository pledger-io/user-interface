import React from "react";
import RestAPI from "./RestAPI";
import {mdiHelpCircle} from "@mdi/js";
import Icon from "@mdi/react";

class TranslationItem {
    constructor() {
        this.resolved = text => void 0
        this.$ = new Promise(resolve => {
            this.resolved = function(localization) {
                resolve(localization);
            }
        })
    }
}

class TranslationService {
    translations = new Map();

    constructor() {
        const defaultLanguage = localStorage.getItem('language') || 'en'
        this.load(defaultLanguage)
    }

    load(language) {
        RestAPI.get(`localization/lang/${language}/`)
            .then(localized => {
                for (const key in localized) {
                    if (!this.translations.has(key)) {
                        this.translations.set(key, new TranslationItem())
                    }
                    this.translations.get(key).resolved(localized[key]);
                }
            });
        localStorage.setItem('language', language)
    }

    get(key) {
        if (!this.translations.has(key)) {
            this.translations.set(key, new TranslationItem());
        }
        return this.translations.get(key).$;
    }
}

class Translation extends React.Component {
    state = {
        localized: '!Not translated!',
        textKey: ''
    }

    render() {
        const {localized, textKey} = this.state
        const {label} = this.props

        if (label !== textKey) {
            service.get(label)
                .then(localization => this.setState({
                    localized: localization,
                    textKey: label
                }))
        }

        return <span className='Translation'>{localized}</span>;
    }
}

class HelpTranslation extends React.Component {
    render() {
        const {label} = this.props

        return (
            <span className='HelpText'>
                <Icon path={mdiHelpCircle} size={.8} />
                <Translation label={label} />
            </span>
        )
    }
}

const service = new TranslationService()

export {
    Translation,
    HelpTranslation,
    service as LocalizationService
}
