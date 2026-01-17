import Image from "next/image";

const flags = ["usa", "mx", "do", "gt", "hn", "af", "ng"];

export default function CountryFlags() {
  return (
    <section className="bg-neutral-900 py-3">
      <div className="flex gap-4 overflow-x-auto px-4 md:justify-center">
        {flags.map(code => (
          <Image
            key={code}
            src={`/flags/${code}.png`}
            alt={code}
            width={32}
            height={22}
            className="flex-shrink-0 opacity-90"
          />
        ))}
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-2">
        Buyers worldwide • Licensed U.S. brokers
      </p>
    </section>
  );
}
