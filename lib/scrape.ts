export async function scrape(url: string) {
  const key = process.env.SCRAPER_API_KEY;

  // ✅ Graceful disable (NO throw)
  if (!key) {
    console.warn("⚠️ Scraper disabled: SCRAPER_API_KEY not set");
    return null;
  }

  const proxyUrl = `https://api.scraperapi.com/?api_key=${key}&country_code=us&device_type=desktop&keep_headers=true&url=${encodeURIComponent(
    url
  )}`;

  const res = await fetch(proxyUrl, {
    method: "GET",
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("❌ Scraper JSON parse failed:", text.slice(0, 300));
    return null;
  }
}
