export async function checkSubscription() {
  try {
    const res = await fetch("/api/user/check-subscription");
    const data = await res.json();
    return data?.subscribed === true;
  } catch {
    return false;
  }
}
