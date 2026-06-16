import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../config/storageKeys";
import es from "./locales/es.json";
import en from "./locales/en.json";

const SUPPORTED = ["es", "en"];

// Idioma del dispositivo (sincrónico); luego se sobreescribe con la preferencia
// guardada si existe (asíncrona).
function deviceLang() {
  const code = (getLocales()?.[0]?.languageCode || "es").toLowerCase();
  return SUPPORTED.includes(code) ? code : "es";
}

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: deviceLang(),
  fallbackLng: "es",
  supportedLngs: SUPPORTED,
  interpolation: { escapeValue: false },
});

// Aplica la preferencia guardada (si el usuario eligió idioma manualmente).
AsyncStorage.getItem(STORAGE_KEYS.LANG).then((saved) => {
  if (SUPPORTED.includes(saved) && saved !== i18n.language) i18n.changeLanguage(saved);
});

export async function setLanguage(lng) {
  if (!SUPPORTED.includes(lng)) return;
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANG, lng);
  } catch {}
  i18n.changeLanguage(lng);
}

export { SUPPORTED };
export default i18n;
