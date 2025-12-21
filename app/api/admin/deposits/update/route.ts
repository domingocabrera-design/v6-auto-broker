import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/auditLog";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user: admin },
  } = await supabase.auth.getUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { depositId, action } = await req.json();

  const { data: before } = await supabaseAdmin
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .single();

  const newStatus = action === "release" ? "released" : "forfeited";

  await supabaseAdmin
    .from("deposits")
    .update({ status: newStatus })
    .eq("id", depositId);

  await logAdminAction({
    adminUserId: admin.id,
    targetUserId: before.user_id,
    action: `DEPOSIT_${action.toUpperCase()}`,
    entity: "deposits",
    entityId: depositId,
    before,
    after: { status: newStatus },
  });

  return NextResponse.json({ success: true });
}
