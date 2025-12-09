export default function PricingEsPage() {
  return (
    <main className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900">
            Elige Cuánto Apoyo Necesitas
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Empieza sencillo. Sube de plan cuando aumente tu volumen de compras.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* STARTER */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-sm font-semibold text-blue-700">STARTER</h3>
            <p className="text-xs text-gray-500 mt-1">ENTRADA FÁCIL</p>

            <div className="mt-6">
              <span className="text-4xl font-bold">$249</span>
              <span className="text-gray-500 ml-1">/mes</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>✓ Acceso completo a la plataforma</li>
              <li>✓ Educación de Copart y escuela de subastas</li>
              <li>✓ Ayuda para buscar vehículos</li>
              <li>✓ Revisión del lote y explicación de daños</li>
            </ul>

            <button className="mt-8 w-full rounded-xl border border-blue-600 text-blue-600 py-2 font-semibold hover:bg-blue-50 transition">
              Empezar
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Sin compromiso de compra. Puedes subir de plan cuando quieras.
            </p>
          </div>

          {/* 3-CAR PRO */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-sm font-semibold text-green-700">3-CAR PRO</h3>
            <p className="text-xs text-gray-500 mt-1">MÁS VELOCIDAD</p>

            <div className="mt-6">
              <span className="text-4xl font-bold">$599</span>
              <span className="text-gray-500 ml-1">/mes</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>✓ Todo lo de Starter</li>
              <li>✓ Revisión prioritaria de lotes</li>
              <li>✓ Manejo de pujas más rápido</li>
              <li>✓ Soporte hasta 3 vehículos por mes</li>
            </ul>

            <button className="mt-8 w-full rounded-xl bg-green-600 text-white py-2 font-semibold hover:bg-green-700 transition">
              Subir a Pro
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Ahorra $100 por vehículo comparado con Starter.
            </p>
          </div>

          {/* 5-CAR ELITE */}
          <div className="rounded-2xl border-2 border-yellow-400 shadow-lg p-8 relative">
            <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
              MÁS POPULAR
            </span>

            <h3 className="text-sm font-semibold text-yellow-700">5-CAR ELITE</h3>
            <p className="text-xs text-gray-500 mt-1">LISTO PARA NEGOCIO</p>

            <div className="mt-6">
              <span className="text-4xl font-bold">$899</span>
              <span className="text-gray-500 ml-1">/mes</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>✓ Todo lo de Pro</li>
              <li>✓ Soporte prioritario Elite</li>
              <li>✓ Recomendaciones tempranas de lotes</li>
              <li>✓ Ayuda con papeleo y preparación de título</li>
            </ul>

            <button className="mt-8 w-full rounded-xl bg-yellow-500 text-white py-2 font-semibold hover:bg-yellow-600 transition">
              Ir Elite
            </button>
          </div>

          {/* 10-CAR MAX */}
          <div className="rounded-2xl border border-red-300 shadow-sm p-8">
            <h3 className="text-sm font-semibold text-red-700">10-CAR MAX</h3>
            <p className="text-xs text-gray-500 mt-1">PODER TOTAL</p>

            <div className="mt-6">
              <span className="text-4xl font-bold">$1,299</span>
              <span className="text-gray-500 ml-1">/mes</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>✓ Todo lo de Elite</li>
              <li>✓ Manejo con máxima prioridad</li>
              <li>✓ Primer vistazo a vehículos calientes</li>
              <li>✓ Asistencia dedicada de cuenta</li>
            </ul>

            <button className="mt-8 w-full rounded-xl bg-red-600 text-white py-2 font-semibold hover:bg-red-700 transition">
              Desbloquear Max
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              MEJOR VALOR
            </p>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-center text-gray-400 max-w-3xl mx-auto">
          La suscripción da acceso a la plataforma y servicios de V6 Auto Broker.
          Se aplica una tarifa de corredor por cada vehículo. El comprador paga
          directamente las tarifas de subasta a las casas de subasta.
        </p>
      </div>
    </main>
  );
}
