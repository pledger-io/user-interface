import { LocalizationRepository } from "../core/RestAPI";

type ResolveFn = (_: string) => void

export type TranslationType = {
    then: (_: ResolveFn) => void,
    resolved: (_: string) => void
}

const translations = new Map<string, TranslationType>()
const computeIfAbsent = (key: string) : TranslationType => {
    if (!translations.has(key)) {
        let resolver: ResolveFn
        let lastValue: string

        const resolved = (value: string) => {
            lastValue = value
            if (!resolver) setTimeout(() => resolved(lastValue), 50)
            else resolver(lastValue)
        }

        translations.set(key, {
            then: (resolve: ResolveFn) => {
                resolver = resolve
                if (lastValue) resolved(lastValue)
            },
            resolved: resolved
        })
    }

    return translations.get(key) as TranslationType
}

const LocalizationService = {
    load: (language: string) => {
        localStorage.setItem('language', language)
        LocalizationRepository.get(language)
            .then((response: Map<string, string>) => {
                Object.entries(response)
                    .forEach(([key, value]) => computeIfAbsent(key)?.resolved(value))
            })
    },
    get: (key: string): TranslationType => computeIfAbsent(key)
}

LocalizationService.load(localStorage.getItem('language') || 'en')

export default LocalizationService