"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function WhatsAppFloat(){
  const [url,setUrl]=useState<string | null>(null);
  useEffect(()=>{
    apiGet("/api/settings/public/").then(d=>{
      const phone = d.whatsapp_phone || "";
      if(!phone) return setUrl(null);
      const clean = String(phone).replace(/[^0-9+]/g,"");
      setUrl(`https://wa.me/${clean}`);
    }).catch(()=>setUrl(null));
  },[]);
  if(!url) return null;
  return (
    <a href={url} target="_blank" className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-3 font-bold text-white shadow-lg">
      WhatsApp
    </a>
  );
}
