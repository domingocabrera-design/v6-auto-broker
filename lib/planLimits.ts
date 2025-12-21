export const PLAN_LIMITS: Record<string, number> = {
  single: 1,
  three: 3,
  five: 5,
  ten: 10,
};

export function getPlanLimit(plan?: string | null) {
  if (!plan) return 0;
  return PLAN_LIMITS[plan] ?? 0;
}
