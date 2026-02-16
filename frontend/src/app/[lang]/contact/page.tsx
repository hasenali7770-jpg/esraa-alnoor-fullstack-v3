"use client";
import { TopNav, Container, Card } from "@/components/ui";
import WhatsAppFloat from "@/components/whatsapp";

export default function Page(){
  return (
    <>
      <TopNav />
      <WhatsAppFloat />
      <main className="py-10">
        <Container>
          <Card className="p-6">
            <h1 className="text-3xl font-extrabold">تواصل معنا</h1>
          </Card>
        </Container>
      </main>
    </>
  );
}
