export default function Filters() {
  return (
    <div className="flex gap-3 flex-wrap mb-6">
      {["Clean Title", "Salvage", "Run & Drive", "Enhanced", "Sedan", "SUV", "Truck"].map(
        (filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-black border border-gray-700 rounded-lg text-sm hover:border-blue-600 transition"
          >
            {filter}
          </button>
        )
      )}
    </div>
  );
}
