import { NextRequest } from "next/server";

export function verifyCron(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) throw new Error("Missing CRON_SECRET");

  if (auth !== `Bearer ${secret}`) {
    return false;
  }

  return true;
}
