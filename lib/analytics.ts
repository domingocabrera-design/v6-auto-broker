export function track(event: string, data?: any) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("v6-analytics", {
      detail: { event, data, ts: Date.now() },
    })
  );
}
