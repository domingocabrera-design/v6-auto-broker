export function SubscriptionGuard({ status }: { status: string }) {
  if (status !== "active" && status !== "trialing") {
    return (
      <div className="bg-red-900 text-red-200 p-3 rounded-lg">
        Your subscription is not active. Please upgrade.
      </div>
    );
  }

  return null;
}
