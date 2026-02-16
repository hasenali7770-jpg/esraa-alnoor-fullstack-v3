"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";
import WhatsAppFloat from "@/components/whatsapp";

type Course = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  price_display: string;
};

export default function Courses(){
  const { lang, currency } = usePrefs();
  const [items,setItems]=useState<Course[]>([]);
  useEffect(()=>{ apiGet(`/api/courses/?lang=${lang}&currency=${currency}`).then(d=>setItems(d.results||d)).catch(()=>setItems([])); },[lang,currency]);
  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          <h1 className="text-3xl font-extrabold">الدورات</h1>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {items.map(c => (
              <Card key={c.id} className="p-4">
                {c.thumbnail_url ? <img src={c.thumbnail_url} className="w-full h-40 object-cover rounded-xl2 border border-[color:var(--border)]" /> : <div className="h-40 rounded-xl2 border border-[color:var(--border)]" />}
                <h3 className="mt-3 text-lg font-extrabold">{c.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{c.short_description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm font-bold">{c.price_display}</div>
                  <Btn href={`/${lang}/courses/${c.slug}`}>عرض</Btn>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
