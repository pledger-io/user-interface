import {LocalizationRepository} from "../RestAPI";

type TranslationType = {
    $: Promise<string>,
    resolved: (_: string) => void
}

class TranslationItem implements TranslationType {
    resolved: (_: string) => void = _ => void 0
    $: Promise<string> = new Promise(resolve => {
        this.resolved = function(localization) {
            resolve(localization);
        }
    })
}

const translations = new Map<string, TranslationType>()
const computeIfAbsent = (key: string) : TranslationType => {
    if (!translations.has(key)) {
        translations.set(key, new TranslationItem())
    }

    return translations.get(key) as TranslationType
}

const LocalizationService = {
    load: (language: string) => {
        LocalizationRepository.get(language)
            .then((response: Map<string, string>) => {
                Object.entries(response)
                    .forEach(([key, value]) => computeIfAbsent(key)?.resolved(value))
            })
    },
    get: (key: string): Promise<string> => computeIfAbsent(key).$
}

LocalizationService.load(localStorage.getItem('language') || 'en')

export default LocalizationService