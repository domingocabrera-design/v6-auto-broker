import FAQSection from "@/components/Faq";
import faqs from "@/content/faqs/en.json";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] text-white">
      <FAQSection faqs={faqs} />
    </main>
  );
}
