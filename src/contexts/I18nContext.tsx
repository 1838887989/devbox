import { createContext, useContext, useState, useCallback } from "react";
import messages, { type Locale, type TranslationKey } from "@/i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  setLocale: () => {},
  t: (key) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useContext(I18nContext).t;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem("devbox-locale") as Locale) || "zh";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("devbox-locale", l);
  };

  const t = useCallback(
    (key: TranslationKey) => {
      return messages[locale][key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
