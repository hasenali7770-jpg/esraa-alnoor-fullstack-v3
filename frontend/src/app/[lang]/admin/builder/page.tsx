"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { Container, TopNav, Btn, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { apiAuthPost, apiGet } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function BuilderPage(){
  const editorRef = useRef<Editor | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("");
  const qp = useSearchParams();
  const slug = qp.get("slug") || "home";
  const locale = (qp.get("locale") || "ar") as "ar"|"en";

  useEffect(() => {
    if (!hostRef.current || editorRef.current) return;

    const editor = grapesjs.init({
      container: hostRef.current,
      height: "75vh",
      storageManager: { type: "none" },
      fromElement: false,
      canvas: { styles: [] },
    });

    editor.BlockManager.add("section", {
      label: "Section",
      content: `<section style="padding:24px;border-radius:16px;background:#0F1A2E;border:1px solid #1E2B44">
        <h2 style="font-size:24px;font-weight:800;color:#EAF2FF">عنوان</h2>
        <p style="color:#9FB0CF;margin-top:8px">نص...</p>
      </section>`
    });

    editor.BlockManager.add("button", {
      label: "Button",
      content: `<a style="display:inline-block;padding:12px 18px;border-radius:16px;background:#2A7D8F;color:white;font-weight:700">زر</a>`
    });

    editor.BlockManager.add("video_ext", {
      label: "Video URL",
      content: `<video controls style="width:100%;max-width:720px;border-radius:16px;border:1px solid #1E2B44;background:#000">
        <source src="https://example.com/video.mp4" />
      </video>`
    });

    editor.Commands.add("upload-media-supabase", {
      run: async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*,video/*";
        input.onchange = async () => {
          if(!input.files || !input.files[0]) return;
          const file = input.files[0];
          const isVideo = file.type.startsWith("video/");
          const folder = isVideo ? "videos" : "images";
          const safeName = file.name.replace(/[^\w.\-]+/g, "_");
          const path = `builder/${folder}/${Date.now()}-${safeName}`;

          const { error } = await supabase.storage
            .from("uploads")
            .upload(path, file, { upsert: true, contentType: file.type });

          if(error){ alert("فشل الرفع: " + error.message); return; }

          const { data } = supabase.storage.from("uploads").getPublicUrl(path);
          const url = data.publicUrl;

          editor.AssetManager.add({ src: url, type: isVideo ? "video" : "image" });

          if(isVideo){
            editor.addComponents(`
              <video controls style="width:100%;max-width:720px;border-radius:16px;border:1px solid #1E2B44;background:#000">
                <source src="${url}" type="${file.type}" />
              </video>
            `);
          }
          setStatus("تم رفع الملف ✅");
        };
        input.click();
      }
    });

    editor.Panels.addButton("options", {
      id: "upload-media",
      className: "fa fa-upload",
      label: "Upload",
      command: "upload-media-supabase",
      attributes: { title: "رفع صورة/فيديو إلى Supabase" },
    });

    editorRef.current = editor;
  }, []);

  async function save(){
    try{
      setStatus("جاري الحفظ...");
      const ed = editorRef.current!;
      const payload = {
        slug,
        title: slug,
        locale,
        content_json: ed.getProjectData(),
        html: ed.getHtml(),
        css: ed.getCss(),
      };
      await apiAuthPost(`/api/pages/admin/upsert/`, payload);
      setStatus("تم الحفظ ✅");
    }catch(e:any){
      setStatus("فشل");
    }
  }

  async function load(){
    try{
      setStatus("جاري التحميل...");
      const data = await apiGet(`/api/pages/by-slug/${slug}/?lang=${locale}`);
      editorRef.current!.loadProjectData(data.content_json || {});
      setStatus("تم التحميل ✅");
    }catch(e:any){
      setStatus("فشل");
    }
  }

  return (
    <>
      <TopNav />
      <main className="py-10">
        <Container>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">Builder: {slug} ({locale})</h1>
            <div className="flex gap-2">
              <Btn variant="ghost" className="px-4 py-2" href={`/${locale}`}>عرض الموقع</Btn>
              <Btn variant="ghost" className="px-4 py-2" onClick={load}>تحميل</Btn>
              <Btn className="px-4 py-2" onClick={save}>حفظ</Btn>
            </div>
          </div>

          <Card className="mt-4 p-4">
            <div className="text-sm text-[color:var(--muted)] mb-3">الحالة: {status || "جاهز"}</div>
            <div ref={hostRef} className="rounded-xl2 overflow-hidden border border-[color:var(--border)]" />
            <div className="mt-3 text-xs text-[color:var(--muted)]">
              لازم Bucket باسم <b>uploads</b> على Supabase + Public.
            </div>
          </Card>
        </Container>
      </main>
    </>
  );
}
