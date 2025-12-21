export default function PricingEsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">

      {/* ================= HEADER ================= */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Precios de V6 Auto Broker
        </h1>
        <p className="text-gray-400 text-lg">
          Acceso simple y transparente a subastas exclusivas para dealers.
        </p>
      </div>

      {/* ================= PLANS ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* PLAN 1 */}
        <PlanCard
          title="Acceso 1 Vehículo"
          price="$249 / mes"
          subtitle="Ideal para compradores primerizos"
          features={[
            "Acceso completo a la plataforma",
            "Comprar hasta 1 vehículo",
            "Soporte básico",
            "Revisión de daños",
            "Proceso guiado",
          ]}
          perCar={[
            "Tarifa total por vehículo ganado: $349",
            "$200 – Tarifa de corretaje",
            "$150 – Título y manejo",
          ]}
        />

        {/* PLAN 2 */}
        <PlanCard
          title="Acceso Pro 3 Vehículos"
          price="$599 / mes"
          subtitle="Mejor valor"
          highlight
          features={[
            "Comprar hasta 3 vehículos",
            "Soporte prioritario",
            "Aprobación rápida",
            "Tarifas reducidas",
            "Asesoría de mercado",
          ]}
          perCar={[
            "Tarifa total por vehículo ganado: $250",
            "$150 – Tarifa de corretaje",
            "$100 – Título y manejo",
          ]}
        />

        {/* PLAN 3 */}
        <PlanCard
          title="Acceso Elite 5 Vehículos"
          price="$899 / mes"
          subtitle="Compradores frecuentes"
          features={[
            "Comprar hasta 5 vehículos",
            "Soporte VIP",
            "Acceso anticipado",
            "Ayuda con documentos",
            "Asistencia de transporte",
          ]}
          perCar={[
            "Tarifa total por vehículo ganado: $250",
            "$150 – Tarifa de corretaje",
            "$100 – Título y manejo",
          ]}
        />

        {/* PLAN 4 */}
        <PlanCard
          title="Plan Dealer 10 Vehículos"
          price="$1,299 / mes"
          subtitle="Compradores de volumen"
          features={[
            "Comprar hasta 10 vehículos",
            "Soporte premium",
            "Asesor personal",
            "Acceso prioritario",
            "Herramientas avanzadas",
          ]}
          perCar={[
            "Tarifa total por vehículo ganado: $250",
            "$150 – Tarifa de corretaje",
            "$100 – Título y manejo",
          ]}
        />
      </div>

      {/* ================= NOTES ================= */}
      <div className="max-w-4xl mx-auto mt-20 text-gray-400 text-sm leading-relaxed">
        <p className="mb-3">
          • Las suscripciones son únicamente para acceso a la plataforma y no son reembolsables.
        </p>
        <p className="mb-3">
          • Las tarifas de corretaje aplican únicamente si el vehículo es ganado.
        </p>
        <p className="mb-3">
          • Los vehículos se venden <strong>TAL CUAL, DONDE SE ENCUENTRAN</strong>.
        </p>
        <p className="mb-3">
          • El precio del vehículo, tarifas de subasta, impuestos, envío y exportación no están incluidos.
        </p>
        <p>
          • La coordinación de envío y la asistencia de exportación son servicios opcionales con costo adicional.
        </p>
      </div>

    </div>
  );
}

/* ================= PLAN CARD ================= */
function PlanCard({
  title,
  price,
  subtitle,
  features,
  perCar,
  highlight,
}: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  perCar: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        relative bg-[#0f0f0f] border border-gray-700 rounded-2xl p-8 shadow-lg
        ${highlight ? "scale-105 border-blue-500 shadow-blue-900/40" : ""}
      `}
    >
      {highlight && (
        <div className="absolute -top-3 right-6 bg-blue-600 text-black text-xs font-bold px-3 py-1 rounded-full">
          MÁS POPULAR
        </div>
      )}

      <h3 className="text-2xl font-bold mb-1">{title}</h3>
      <p className="text-blue-400 font-extrabold text-4xl mb-2">{price}</p>
      <p className="text-gray-400 text-sm mb-6">{subtitle}</p>

      <ul className="space-y-2 text-sm mb-6">
        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <div className="border-t border-gray-700 pt-4 text-sm text-gray-300">
        {perCar.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <a
        href="/es/signup"
        className="block mt-6 text-center py-3 rounded-xl bg-blue-600 text-black font-bold hover:bg-blue-500 transition"
      >
        Elegir Plan
      </a>
    </div>
  );
}
