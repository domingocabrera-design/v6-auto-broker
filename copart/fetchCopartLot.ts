export default async function fetchCopartLot(
  lotId: string,
  extraOptions: any = {}
) {
  try {
    const url = `https://www.copart.com/public/data/lotdetails/solr/${lotId}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0",
        Accept: "application/json, text/plain, */*",
        Referer: `https://www.copart.com/lot/${lotId}`,
      },
      cache: "no-store",
      ...extraOptions, // ⬅️ allows overriding headers if needed
    });

    const text = await res.text();

    // Copart often sends HTML when rate-limited or blocked.
    if (!text.trim().startsWith("{")) {
      console.warn(
        "⚠️ Copart returned HTML instead of JSON. Possible block or rate-limit."
      );
      return null;
    }

    const json = JSON.parse(text);

    // Validate structure
    if (!json?.data?.lotDetails) {
      console.warn("⚠️ Copart JSON missing lotDetails:", json);
      return null;
    }

    return json.data.lotDetails;
  } catch (error) {
    console.error("fetchCopartLot ERROR:", error);
    return null;
  }
}
