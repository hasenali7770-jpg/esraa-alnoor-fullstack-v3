"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";

export default function AdminHome(){
  const { lang } = usePrefs();
  const [isAdmin,setIsAdmin]=useState<boolean | null>(null);

  useEffect(()=>{
    (async ()=>{
      const { data } = await supabase.auth.getSession();
      if(!data.session){ window.location.href = `/${lang}/login`; return; }
      const d = await apiGet("/api/admin/me/");
      setIsAdmin(!!d.is_admin);
    })();
  },[lang]);

  if(isAdmin === null){
    return (<><TopNav /><main className="py-10"><Container><Card className="p-6">...</Card></Container></main></>);
  }
  if(!isAdmin){
    return (<><TopNav /><main className="py-10"><Container><Card className="p-6">هذا الحساب ليس مسؤولاً</Card></Container></main></>);
  }

  return (
    <>
      <TopNav />
      <main className="py-10">
        <Container>
          <h1 className="text-3xl font-extrabold">لوحة التحكم</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="p-5"><div className="font-extrabold">الصفحات</div><div className="mt-3"><Btn href={`/${lang}/admin/pages`}>إدارة الصفحات</Btn></div></Card>
            <Card className="p-5"><div className="font-extrabold">أكواد التفعيل</div><div className="mt-3"><Btn href={`/${lang}/admin/activation`}>توليد أكواد</Btn></div></Card>
            <Card className="p-5"><div className="font-extrabold">إعدادات</div><div className="mt-3"><Btn href={`/${lang}/admin/settings`}>روابط ودعم</Btn></div></Card>
          </div>
        </Container>
      </main>
    </>
  );
}
