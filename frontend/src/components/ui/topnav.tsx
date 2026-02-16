"use client";
import React, { useEffect, useState } from "react";
import { Container } from "./layout";
import { Btn } from "./btn";
import { usePrefs } from "@/lib/context/prefs";
import { supabase } from "@/lib/supabase";

export function TopNav(){
  const { lang, currency, setCurrency, toggleTheme, theme } = usePrefs();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({data}) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setUserEmail(sess?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const otherLang = lang === "ar" ? "en" : "ar";
  const otherLangLabel = lang === "ar" ? "EN" : "AR";

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-black/30 backdrop-blur">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Btn variant="ghost" href={`/${lang}`}>الرئيسية</Btn>
            <Btn variant="ghost" href={`/${lang}/courses`}>الدورات</Btn>
            <Btn variant="ghost" href={`/${lang}/pricing`}>الأسعار</Btn>
            <Btn variant="ghost" href={`/${lang}/about`}>من نحن</Btn>
            <Btn variant="ghost" href={`/${lang}/contact`}>تواصل معنا</Btn>
            <Btn variant="ghost" href={`/${lang}/activate`}>تفعيل</Btn>
            <Btn variant="ghost" href={`/${lang}/admin`}>لوحة التحكم</Btn>
          </div>

          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={toggleTheme}>{theme==="dark"?"فاتح":"داكن"}</Btn>
            <Btn variant="ghost" onClick={() => setCurrency(currency==="USD"?"IQD":"USD")}>{currency}</Btn>
            <Btn variant="ghost" href={`/${otherLang}`}>{otherLangLabel}</Btn>
            {userEmail ? (
              <Btn variant="ghost" onClick={() => supabase.auth.signOut()}>خروج</Btn>
            ) : (
              <Btn variant="ghost" href={`/${lang}/login`}>دخول</Btn>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
