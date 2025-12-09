import { NextRequest } from "next/server";
import { WebSocketServer } from "ws";

// Simple helper to fetch live bid
async function fetchBid(lotId: string) {
  try {
    const res = await fetch(
      `https://www.copart.com/public/data/lotdetails/solr/${lotId}`
    );
    const json = await res.json();
    return json?.data?.lotDetails?.lotCurrentBidAmount || null;
  } catch (err) {
    console.log("Error fetching bid:", err);
    return null;
  }
}

// Use global object so server doesn't restart WSS every request
const globalAny: any = global;

if (!globalAny.wss) {
  globalAny.wss = new WebSocketServer({ noServer: true });
  console.log("🔥 WebSocket Server for Live Bids Started");

  // When a client connects…
  globalAny.wss.on("connection", (ws: any, req: any) => {
    const url = new URL(req.url, "http://localhost");
    const lotId = url.searchParams.get("lotId");

    if (!lotId) {
      ws.close();
      return;
    }

    console.log("⚡ Client connected to live WS for lot:", lotId);

    // Poll Copart every 1 second
    const interval = setInterval(async () => {
      const bid = await fetchBid(lotId);
      if (bid !== null) {
        ws.send(JSON.stringify({ bid }));
      }
    }, 1000);

    ws.on("close", () => {
      clearInterval(interval);
      console.log("❌ Client disconnected from live WS");
    });
  });
}

// Required for Next.js to upgrade the connection
export const GET = async (req: NextRequest) => {
  const { socket } = (req as any);

  globalAny.wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws: any) => {
    globalAny.wss.emit("connection", ws, req);
  });
};
