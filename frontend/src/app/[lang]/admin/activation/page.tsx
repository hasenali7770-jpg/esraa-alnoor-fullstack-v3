"use client";
import { useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiAuthPost } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";

export default function ActivationAdmin(){
  const { lang } = usePrefs();
  const [email,setEmail]=useState("");
  const [courseSlug,setCourseSlug]=useState("");
  const [code,setCode]=useState("");
  const [msg,setMsg]=useState("");

  async function gen(){
    setMsg("...");
    const d = await apiAuthPost("/api/activation/admin/generate/", { user_email: email, course_slug: courseSlug || null });
    setCode(d.code);
    setMsg("تم توليد الكود ✅");
  }

  return (
    <>
      <TopNav />
      <main className="py-10">
        <Container>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">توليد كود تفعيل</h1>
            <Btn href={`/${lang}/admin`}>رجوع</Btn>
          </div>
          <Card className="mt-4 p-6 grid gap-3 max-w-xl">
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="User Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" placeholder="Course Slug (optional)" value={courseSlug} onChange={e=>setCourseSlug(e.target.value)} />
            <Btn onClick={gen}>توليد</Btn>
            {code && <div className="rounded-xl2 border border-[color:var(--border)] p-3 font-extrabold">{code}</div>}
            <div className="text-sm text-[color:var(--muted)]">{msg}</div>
          </Card>
        </Container>
      </main>
    </>
  );
}
