"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en";
type Currency = "USD" | "IQD";
type Theme = "dark" | "light";

type Prefs = {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  theme: Theme;
  toggleTheme: () => void;
};

const Ctx = createContext<Prefs | null>(null);

export function PrefsProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedCur = (localStorage.getItem("currency") as Currency | null);
    if(savedCur) setCurrencyState(savedCur);
    const savedTheme = (localStorage.getItem("theme") as Theme | null);
    if(savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => { localStorage.setItem("currency", currency); }, [currency]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(() => ({
    lang,
    setLang: (l: Lang) => setLangState(l),
    currency,
    setCurrency: (c: Currency) => setCurrencyState(c),
    theme,
    toggleTheme: () => setTheme(t => t==="dark"?"light":"dark"),
  }), [lang, currency, theme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(){
  const v = useContext(Ctx);
  if(!v) throw new Error("PrefsProvider missing");
  return v;
}
