"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiGet, apiAuthPost } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";

export default function PagesAdmin(){
  const { lang } = usePrefs();
  const [pages,setPages]=useState<any[]>([]);
  const [slug,setSlug]=useState("home");
  const [title,setTitle]=useState("الرئيسية");

  async function refresh(){
    const d = await apiGet("/api/pages/admin/list/");
    setPages(d.results||d);
  }
  useEffect(()=>{ refresh(); },[]);

  async function create(){
    await apiAuthPost("/api/pages/admin/create/", { slug, title });
    await refresh();
  }

  return (
    <>
      <TopNav />
      <main className="py-10">
        <Container>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">إدارة الصفحات</h1>
            <Btn href={`/${lang}/admin`}>رجوع</Btn>
          </div>

          <Card className="mt-4 p-5">
            <div className="font-extrabold">إضافة صفحة</div>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug مثل home" />
              <input className="rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" value={title} onChange={e=>setTitle(e.target.value)} placeholder="العنوان" />
              <Btn onClick={create}>إنشاء</Btn>
            </div>
          </Card>

          <div className="mt-5 grid gap-3">
            {pages.map(p=>(
              <Card key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-extrabold">{p.slug}</div>
                  <div className="text-sm text-[color:var(--muted)]">{p.title} • {p.locale}</div>
                </div>
                <div className="flex gap-2">
                  <Btn variant="ghost" href={`/${lang}/admin/builder?slug=${p.slug}&locale=ar`}>Builder AR</Btn>
                  <Btn variant="ghost" href={`/${lang}/admin/builder?slug=${p.slug}&locale=en`}>Builder EN</Btn>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
