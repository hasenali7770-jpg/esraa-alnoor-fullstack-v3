"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiAuthPost, apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";

export default function SettingsAdmin(){
  const { lang } = usePrefs();
  const [s,setS]=useState<any>({});
  const [msg,setMsg]=useState("");

  useEffect(()=>{ apiGet("/api/admin/settings/").then(setS).catch(()=>setS({})); },[]);

  async function save(){
    setMsg("...");
    const d = await apiAuthPost("/api/admin/settings/update/", s);
    setS(d);
    setMsg("تم ✅");
  }

  return (
    <>
      <TopNav />
      <main className="py-10">
        <Container>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">إعدادات الموقع</h1>
            <Btn href={`/${lang}/admin`}>رجوع</Btn>
          </div>
          <Card className="mt-4 p-6 grid gap-3 max-w-2xl">
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="WhatsApp phone" value={s.whatsapp_phone||""} onChange={e=>setS({...s,whatsapp_phone:e.target.value})} />
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Instagram" value={s.instagram||""} onChange={e=>setS({...s,instagram:e.target.value})} />
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Facebook" value={s.facebook||""} onChange={e=>setS({...s,facebook:e.target.value})} />
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Telegram" value={s.telegram||""} onChange={e=>setS({...s,telegram:e.target.value})} />
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Support Email" value={s.email||""} onChange={e=>setS({...s,email:e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="USD->IQD rate" value={s.usd_to_iqd_rate||1300} onChange={e=>setS({...s,usd_to_iqd_rate:Number(e.target.value)})} />
              <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="IQD round to" value={s.iqd_round_to||500} onChange={e=>setS({...s,iqd_round_to:Number(e.target.value)})} />
            </div>
            <Btn onClick={save}>حفظ</Btn>
            <div className="text-sm text-[color:var(--muted)]">{msg}</div>
          </Card>
        </Container>
      </main>
    </>
  );
}
