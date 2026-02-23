"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";
import WhatsAppFloat from "@/components/whatsapp";

export default function Home(){
  const { lang } = usePrefs();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← أضف حالة التحميل

  useEffect(() => {
    setLoading(true);
    apiGet(`/api/pages/by-slug/home/?lang=${lang}`)
      .then(d => setHtml(d.html ?? null))
      .catch(() => setHtml(null))
      .finally(() => setLoading(false));
  }, [lang]);

  // إذا كان جاري التحميل، اعرض مؤشر تحميل
  if (loading) {
    return (
      <>
        <TopNav />
        <Container className="py-20 text-center">
          <div className="text-muted">جاري التحميل...</div>
        </Container>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          {html ? (
            <div className="max-w-none prose dark:prose-invert" dangerouslySetInnerHTML={{__html: html}} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div>
                <div className="inline-flex rounded-full border border-stroke bg-white/80 dark:bg-night-bg/80 px-3 py-1 text-xs text-muted dark:text-night-muted">
                  أكاديمية إسراء النور • تطوير ووعي
                </div>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink dark:text-night-text">
                  رحلة وعي... بخطوات عملية
                </h1>
                <p className="mt-3 text-muted dark:text-night-muted">
                  منصة كورسات عربية/إنكليزية مع مشاهدة قصيرة، وتفعيل بعد الدفع أو كود.
                </p>
                <div className="mt-5 flex gap-3">
                  <Btn href={`/${lang}/courses`}>استعرض الدورات</Btn>
                  <Btn variant="ghost" href={`/${lang}/activate`}>كيف يتم التفعيل؟</Btn>
                </div>
              </div>
              <Card className="p-6 min-h-[420px] bg-white dark:bg-night-surface border border-stroke dark:border-night-stroke">
                <div className="text-sm text-muted dark:text-night-muted">Esraa Al-Noor</div>
              </Card>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
