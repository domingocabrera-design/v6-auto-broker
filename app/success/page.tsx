export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-green-600">🎉 You're All Set!</h1>
      <p className="mt-4 text-lg text-gray-700 text-center max-w-lg">
        Your 7-day free trial has begun. You now have full access to the V6 Auto Broker platform.
      </p>

      <a
        href="/dashboard"
        className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
      >
        Go to Dashboard
      </a>
    </main>
  );
}
