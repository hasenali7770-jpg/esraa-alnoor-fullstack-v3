"use client";

import { useState } from "react";
import { Container } from "@/components/Container";  // ✅ تم تعديل المسار
import { supabase } from "@/lib/supabase";

export default function AdminActivationPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      // كود تجريبي - استبدله بالمنطق الحقيقي لاحقاً
      const newCode = `ALN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setCode(newCode);
      setMessage("✅ تم إنشاء الكود بنجاح");
    } catch (error) {
      setMessage("❌ حدث خطأ في إنشاء الكود");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold mb-6">إدارة أكواد التفعيل</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* قسم إنشاء كود جديد */}
        <div className="rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <h2 className="text-lg font-semibold mb-4">إنشاء كود تفعيل جديد</h2>
          
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء كود جديد"}
          </button>

          {code && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-night-bg rounded-xl">
              <p className="text-sm font-medium mb-2">الكود الجديد:</p>
              <p className="text-lg font-bold text-brand">{code}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setMessage("✅ تم نسخ الكود");
                }}
                className="mt-2 text-sm text-muted hover:text-ink"
              >
                نسخ الكود
              </button>
            </div>
          )}

          {message && (
            <div className="mt-4 text-sm text-center text-muted">
              {message}
            </div>
          )}
        </div>

        {/* قسم البحث عن الأكواد */}
        <div className="rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <h2 className="text-lg font-semibold mb-4">البحث عن كود</h2>
          
          <input
            type="text"
            placeholder="أدخل كود التفعيل"
            className="w-full rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 dark:border-night-stroke dark:bg-night-bg"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          
          <button
            onClick={() => setMessage("🔍 جاري البحث...")}
            className="mt-4 w-full rounded-xl bg-white border border-stroke px-4 py-3 text-sm font-medium text-ink transition hover:bg-gray-50 dark:border-night-stroke dark:bg-night-bg dark:text-night-text"
          >
            بحث
          </button>
        </div>

        {/* قائمة الأكواد الأخيرة */}
        <div className="md:col-span-2 rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <h2 className="text-lg font-semibold mb-4">آخر الأكواد المستخدمة</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke dark:border-night-stroke">
                  <th className="py-3 text-right">الكود</th>
                  <th className="py-3 text-right">المستخدم</th>
                  <th className="py-3 text-right">الحالة</th>
                  <th className="py-3 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    لا توجد أكواد حتى الآن
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
}
