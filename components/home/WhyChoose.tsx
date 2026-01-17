export default function WhyChoose() {
  return (
    <section className="bg-neutral-900 py-14 text-white">
      <h2 className="text-xl font-bold text-center mb-8">
        Why Buyers Choose V6 Auto Broker
      </h2>

      <div className="grid gap-5 md:grid-cols-3 max-w-6xl mx-auto px-4">
        <div className="bg-neutral-800 p-5 rounded-xl">
          <p className="italic text-sm">
            “No dealer license, no headaches.”
          </p>
          <p className="text-xs text-gray-400 mt-2">John D. · CA</p>
        </div>

        <div className="bg-neutral-800 p-5 rounded-xl">
          <p className="italic text-sm">
            “Saved thousands vs dealerships.”
          </p>
          <p className="text-xs text-gray-400 mt-2">Angela R. · FL</p>
        </div>

        <div className="bg-neutral-800 p-5 rounded-xl">
          <p className="italic text-sm">
            “Transparent pricing. No games.”
          </p>
          <p className="text-xs text-gray-400 mt-2">Carlos M. · NJ</p>
        </div>
      </div>
    </section>
  );
}
