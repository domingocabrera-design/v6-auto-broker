// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

// ENV variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Safety checks
if (!supabaseUrl) throw new Error("Missing env NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseAnonKey) throw new Error("Missing env NEXT_PUBLIC_SUPABASE_ANON_KEY");
if (!supabaseServiceKey) throw new Error("Missing env SUPABASE_SERVICE_ROLE_KEY");

// 1️⃣ Admin client (full access, server only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// 2️⃣ Server-side user client (safe for server components)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}
