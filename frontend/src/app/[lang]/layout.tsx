import "../globals.css";
import { PrefsProvider } from "@/lib/context/prefs";

export const metadata = { title: "Esraa Al-Noor" };

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: "ar" | "en" } }) {
  const dir = params.lang === "ar" ? "rtl" : "ltr";
  return (
    <html lang={params.lang} dir={dir}>
      <body>
        <PrefsProvider initialLang={params.lang}>
          {children}
        </PrefsProvider>
      </body>
    </html>
  );
}
