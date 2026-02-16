"use client";
import { useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiAuthPost } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { usePrefs } from "@/lib/context/prefs";
import WhatsAppFloat from "@/components/whatsapp";

export default function Activate(){
  const { lang } = usePrefs();
  const [code,setCode]=useState("");
  const [msg,setMsg]=useState("");

  async function redeem(){
    const { data } = await supabase.auth.getSession();
    if(!data.session){ window.location.href = `/${lang}/login`; return; }
    try{
      const res = await apiAuthPost("/api/activation/redeem/", { code });
      setMsg(res.message || "تم ✅");
    }catch(e:any){
      setMsg("فشل التفعيل");
    }
  }

  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          <Card className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-extrabold">تفعيل الوصول</h1>
            <div className="mt-4 grid gap-3">
              <input className="w-full rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Activation Code" value={code} onChange={e=>setCode(e.target.value)} />
              <Btn onClick={redeem}>تفعيل الآن</Btn>
              <div className="text-sm text-[color:var(--muted)]">{msg}</div>
            </div>
          </Card>
        </Container>
      </main>
    </>
  );
}
