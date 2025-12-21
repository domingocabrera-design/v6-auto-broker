import { supabaseAdmin } from "@/lib/supabase/admin";

type AuditParams = {
  adminUserId: string;
  targetUserId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  before?: any;
  after?: any;
};

export async function logAdminAction({
  adminUserId,
  targetUserId,
  action,
  entity,
  entityId,
  before,
  after,
}: AuditParams) {
  await supabaseAdmin.from("admin_audit_logs").insert({
    admin_user_id: adminUserId,
    target_user_id: targetUserId ?? null,
    action,
    entity,
    entity_id: entityId ?? null,
    before: before ?? null,
    after: after ?? null,
  });
}
