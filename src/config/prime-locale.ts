import i18nRepository, { SupportedLocales } from "../core/repositories/i18n-repository";
import { addLocale, localeOption } from "primereact/api";

function getLocale(): SupportedLocales {
  const locale = localStorage.getItem('language')
  if (locale) return locale.replaceAll('"', '') as SupportedLocales
  return 'en'
}

export const i10n = (key: string): string => {
  return localeOption(key, getLocale()) ||
    `_missing_localization_${ key }_${ getLocale() }_`
}

// Preload all languages into the web-application
const _ = async () => {
  for (const language of ['en', 'nl', 'de']) {
    const response = await i18nRepository.get(language as SupportedLocales)
    addLocale(language, response)
  }
}

export default _
