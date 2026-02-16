"use client";
import { useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { usePrefs } from "@/lib/context/prefs";

export default function Login(){
  const { lang } = usePrefs();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");

  async function signIn(){
    setMsg("...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "تم الدخول ✅");
    if(!error) window.location.href = `/${lang}`;
  }

  async function signUp(){
    setMsg("...");
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "تم إنشاء الحساب ✅ (قد تحتاج تأكيد ايميل)");
  }

  return (
    <>
      <TopNav />
      <main className="py-10">
        <Container>
          <Card className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-extrabold">تسجيل الدخول</h1>
            <div className="mt-4 grid gap-3">
              <input className="w-full rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input className="w-full rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              <div className="flex gap-2">
                <Btn onClick={signIn}>دخول</Btn>
                <Btn variant="ghost" onClick={signUp}>إنشاء حساب</Btn>
              </div>
              <div className="text-sm text-[color:var(--muted)]">{msg}</div>
            </div>
          </Card>
        </Container>
      </main>
    </>
  );
}
