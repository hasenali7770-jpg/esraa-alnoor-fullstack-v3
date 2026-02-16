import { supabase } from "./supabase";
const API = process.env.NEXT_PUBLIC_API_URL!;

export async function apiGet(path: string){
  const res = await fetch(API + path, { cache: "no-store" });
  if(!res.ok) throw new Error("API error");
  return res.json();
}

export async function apiAuthPost(path: string, body: any){
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(API + path, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
