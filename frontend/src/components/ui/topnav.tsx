"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export function TopNav() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // جلب المستخدم الحالي
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };

    fetchUser();

    // الاستماع لتغييرات حالة تسجيل الدخول - مع تحديد any
    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, sess: any) => {
      setUserEmail(sess?.user?.email ?? null);
    });

    return () => sub?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b border-stroke bg-white/80 backdrop-blur dark:border-night-stroke dark:bg-night-bg/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-ink dark:text-night-text">
          Esraa Al-Noor
        </Link>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="text-sm text-muted dark:text-night-muted">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                تسجيل خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              تسجيل دخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
