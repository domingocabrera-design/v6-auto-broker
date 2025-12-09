export default function CancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-red-600">Checkout Canceled</h1>
      <p className="mt-4 text-lg text-gray-700 text-center max-w-lg">
        No worries — you can start your 7-day trial anytime.
      </p>

      <a
        href="/pricing"
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
      >
        Return to Pricing
      </a>
    </main>
  );
}
