
import { createContext, useState, useContext, ReactNode } from "react";
import { translations, languages } from "@/utils/translations";

type LanguageContextType = {
  language: string;
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  availableLanguages: Record<string, string>;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  t: () => "",
  changeLanguage: () => {},
  availableLanguages: languages,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  const t = (key: string) => {
    const lang = language as keyof typeof translations;
    return translations[lang]?.[key as keyof typeof translations[typeof lang]] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
        changeLanguage,
        availableLanguages: languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
