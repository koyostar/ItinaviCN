"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type Language = "en" | "zh";

interface UserPreferences {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const UserPreferencesContext = createContext<UserPreferences | undefined>(
  undefined,
);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("preferredLanguage");
    return saved === "en" || saved === "zh" ? saved : "zh";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  return (
    <UserPreferencesContext.Provider value={{ language, setLanguage }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider",
    );
  }
  return context;
}
