import { useAuth } from "../context/AuthContext";
import { NO_PERMISSIONS, type Permission } from "../lib/permissions";

/**
 * Signed-in staff member's role & permissions (UI only — the database
 * enforces the same rules through RLS).
 */
export function usePermissions() {
  const { profile, email } = useAuth();
  const role = profile?.role ?? null;
  const permissions = profile?.permissions ?? NO_PERMISSIONS;

  const can = (permission: Permission) => role === "super_admin" || permissions[permission] === true;
  const canAny = (list: Permission[]) => list.length === 0 || list.some(can);

  return {
    email,
    role,
    permissions,
    loading: profile === undefined,
    can,
    canAny,
    isSuperAdmin: role === "super_admin",
  };
}
