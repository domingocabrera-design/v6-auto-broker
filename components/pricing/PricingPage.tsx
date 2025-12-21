import { getDict, Lang } from "@/lib/i18n";

export default function PricingPage({ lang }: { lang: Lang }) {
  const t = getDict(lang).pricing;

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">

      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">{t.title}</h1>
        <p className="text-gray-400 text-lg">{t.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto mt-20 text-gray-400 text-sm">
        {t.notes.map((n, i) => (
          <p key={i} className="mb-3">• {n}</p>
        ))}
      </div>

    </div>
  );
}
