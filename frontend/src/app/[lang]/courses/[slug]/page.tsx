"use client";
import { useEffect, useState } from "react";
import { TopNav, Container, Card, Btn } from "@/components/ui";
import { apiAuthPost, apiGet } from "@/lib/api";
import { usePrefs } from "@/lib/context/prefs";
import { supabase } from "@/lib/supabase";
import WhatsAppFloat from "@/components/whatsapp";

type Lesson = { id:number; title:string; video_url:string|null; is_preview:boolean; };
type Section = { id:number; title:string; lessons: Lesson[] };
type Course = { id:number; slug:string; title:string; description:string; price_display:string; has_access:boolean; sections: Section[] };

export default function CoursePage({ params }: { params:{ lang:"ar"|"en"; slug:string } }){
  const { lang, currency } = usePrefs();
  const [course,setCourse]=useState<Course | null>(null);
  const [selected,setSelected]=useState<Lesson | null>(null);
  const [comment,setComment]=useState("");
  const [comments,setComments]=useState<any[]>([]);
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    apiGet(`/api/courses/${params.slug}/?lang=${lang}&currency=${currency}`).then(d=> setCourse(d)).catch(()=>setCourse(null));
    apiGet(`/api/comments/?target_type=course&slug=${params.slug}`).then(d=>setComments(d.results||d)).catch(()=>setComments([]));
  },[lang, currency, params.slug]);

  const canPlay = (lesson: Lesson) => (lesson.is_preview || !!course?.has_access);

  async function play(lesson: Lesson){
    const { data } = await supabase.auth.getSession();
    if(!data.session && !lesson.is_preview){
      window.location.href = `/${lang}/login`;
      return;
    }
    if(!canPlay(lesson)){
      setMsg("لا تملك صلاحية مشاهدة هذا الدرس. فعّل الوصول أو اشترِ الكورس.");
      return;
    }
    setSelected(lesson);
    setMsg("");
  }

  async function addComment(){
    const { data } = await supabase.auth.getSession();
    if(!data.session){ window.location.href = `/${lang}/login`; return; }
    await apiAuthPost("/api/comments/create/", { target_type:"course", target_slug: params.slug, content: comment });
    setComment("");
    const d = await apiGet(`/api/comments/?target_type=course&slug=${params.slug}`);
    setComments(d.results||d);
  }

  if(!course){
    return (<><TopNav /><main className="py-10"><Container>غير موجود</Container></main></>);
  }

  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="p-5">
                <h1 className="text-3xl font-extrabold">{course.title}</h1>
                <div className="mt-2 text-[color:var(--muted)]">{course.price_display}</div>
                <p className="mt-4 text-[color:var(--muted)] whitespace-pre-wrap">{course.description}</p>
                {msg && <div className="mt-3 text-sm text-red-300">{msg}</div>}
              </Card>

              <Card className="mt-5 p-5">
                <h2 className="text-xl font-extrabold">المشاهدة</h2>
                {selected?.video_url ? (
                  <div className="mt-3">
                    <video controls style={{width:"100%", borderRadius: 16, border:"1px solid rgba(255,255,255,0.12)", background:"#000"}}>
                      <source src={selected.video_url} />
                    </video>
                    <div className="mt-2 text-sm text-[color:var(--muted)]">{selected.title}</div>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-[color:var(--muted)]">اختر درساً من القائمة</div>
                )}
              </Card>

              <Card className="mt-5 p-5">
                <h2 className="text-xl font-extrabold">التعليقات</h2>
                <div className="mt-3 grid gap-2">
                  {comments.map((c:any)=>(
                    <div key={c.id} className="rounded-xl2 border border-[color:var(--border)] p-3">
                      <div className="text-xs text-[color:var(--muted)]">{c.user_email || "مستخدم"}</div>
                      <div className="mt-1">{c.content}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2">
                  <textarea className="w-full rounded-xl2 border border-[color:var(--border)] bg-transparent px-4 py-3" value={comment} onChange={e=>setComment(e.target.value)} placeholder="اكتب تعليقك..." />
                  <Btn onClick={addComment}>إرسال</Btn>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-5">
                <h3 className="text-lg font-extrabold">محتوى الدورة</h3>
                <div className="mt-3 grid gap-3">
                  {course.sections.map(sec=>(
                    <div key={sec.id} className="rounded-xl2 border border-[color:var(--border)] p-3">
                      <div className="font-bold">{sec.title}</div>
                      <div className="mt-2 grid gap-2">
                        {sec.lessons.map(ls=>(
                          <button key={ls.id} onClick={()=>play(ls)} className="text-left rounded-xl2 border border-[color:var(--border)] px-3 py-2 hover:bg-white/5">
                            <div className="text-sm font-bold">{ls.title}</div>
                            <div className="text-xs text-[color:var(--muted)]">{ls.is_preview ? "Preview" : "Full"}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="mt-5 p-5">
                <Btn href={`/${lang}/activate`} className="w-full">تفعيل الوصول</Btn>
              </Card>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
