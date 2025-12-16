import normalizeLot from "./normalizeLot";

const API_KEY = process.env.SCRAPERAPI_KEY;

export default async function getCopartLot(lotId: string) {
  try {
    const url = `https://www.copart.com/public/data/lotdetails/lot/${lotId}`;

    // ScraperAPI endpoint
    const scraperUrl = `https://api.scraperapi.com/`;
    const finalUrl = `${scraperUrl}?api_key=${API_KEY}&url=${encodeURIComponent(url)}&country_code=us&render=false`;

    const res = await fetch(finalUrl);
    const text = await res.text();

    // Try to parse JSON (ScraperAPI might return HTML if blocked)
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.log("⚠️ ScraperAPI returned non-JSON:", text.slice(0, 200));
      return null;
    }

    const lot = data?.data?.lotDetails || null;
    if (!lot) return null;

    return normalizeLot(lot);
  } catch (err) {
    console.error("COPART FETCH ERROR:", err);
    return null;
  }
}
