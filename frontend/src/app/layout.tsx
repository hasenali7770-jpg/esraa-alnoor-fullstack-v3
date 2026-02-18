throw new Error("DEPLOY_TEST_SHOULD_APPEAR");
export const metadata = {
  title: "Esraa Al-Noor",
  description: "Esraa Al-Noor Academy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
