"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";
import WhatsAppFloat from "@/components/whatsapp";

export default function Pricing(){
  const { lang, currency } = usePrefs();
  const [plans,setPlans]=useState<any[]>([]);
  useEffect(()=>{ apiGet(`/api/pricing/?lang=${lang}&currency=${currency}`).then(d=>setPlans(d.results||d)).catch(()=>setPlans([])); },[lang,currency]);
  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          <h1 className="text-3xl font-extrabold">الأسعار</h1>
          <div className="mt-6 grid gap-5 md:grid-cols-4">
            {plans.map(p=>(
              <Card key={p.id} className="p-5 text-center">
                <div className="text-sm text-[color:var(--muted)]">{p.name}</div>
                <div className="mt-2 text-2xl font-extrabold">{p.price_display}</div>
                <div className="mt-2 text-sm text-[color:var(--muted)]">{p.note || ""}</div>
                <Btn className="mt-4 w-full" href={`/${lang}/activate`}>ابدأ الآن</Btn>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
