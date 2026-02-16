"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";
import WhatsAppFloat from "@/components/whatsapp";

export default function Home(){
  const { lang } = usePrefs();
  const [html,setHtml]=useState<string | null>(null);

  useEffect(() => {
    apiGet(`/api/pages/by-slug/home/?lang=${lang}`).then(d => setHtml(d.html ?? null)).catch(()=>setHtml(null));
  }, [lang]);

  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          {html ? (
            <div className="max-w-none" dangerouslySetInnerHTML={{__html: html}} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div>
                <div className="inline-flex rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--muted)]">أكاديمية إسراء النور • تطوير ووعي</div>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight">رحلة وعي... بخطوات عملية</h1>
                <p className="mt-3 text-[color:var(--muted)]">منصة كورسات عربية/إنكليزية مع مشاهدة قصيرة، وتفعيل بعد الدفع أو كود.</p>
                <div className="mt-5 flex gap-3">
                  <Btn href={`/${lang}/courses`}>استعرض الدورات</Btn>
                  <Btn variant="ghost" href={`/${lang}/activate`}>كيف يتم التفعيل؟</Btn>
                </div>
              </div>
              <Card className="p-6 min-h-[420px]">
                <div className="text-sm text-[color:var(--muted)]">Esraa Al-Noor</div>
              </Card>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
