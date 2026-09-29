/**
 * Admin roles & permissions — mirrors public.role_permissions and the RLS
 * policies in supabase/migrations/20260927010000_admin_roles.sql.
 * The database is the source of truth; this file only drives the admin UI.
 */

export const PERMISSION_KEYS = [
  "products",
  "inventory",
  "orders",
  "customers",
  "discounts",
  "marketing",
  "settings",
  "security",
  "users",
  "analytics",
] as const;

export type Permission = (typeof PERMISSION_KEYS)[number];
export type UserPermissions = Record<Permission, boolean>;

export type StaffRole = "super_admin" | "store_manager" | "customer_support";

export const NO_PERMISSIONS: UserPermissions = Object.fromEntries(
  PERMISSION_KEYS.map((k) => [k, false])
) as UserPermissions;

export const ALL_PERMISSIONS: UserPermissions = Object.fromEntries(
  PERMISSION_KEYS.map((k) => [k, true])
) as UserPermissions;

export const ROLES: { value: StaffRole; label: string; description: string; badge: string }[] = [
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Full access to everything, including users",
    badge: "bg-[#1528A1]/10 text-[#1528A1]",
  },
  {
    value: "store_manager",
    label: "Store Manager",
    description: "Products, inventory, orders, discounts & marketing",
    badge: "bg-[#479BF7]/15 text-[#1160CB]",
  },
  {
    value: "customer_support",
    label: "Customer Support",
    description: "Orders & customers only",
    badge: "bg-emerald-50 text-emerald-600",
  },
];

export const roleLabel = (role: string | null | undefined) =>
  ROLES.find((r) => r.value === role)?.label ?? "Customer";

/** Grouped for the permission preview in the Users page */
export const PERMISSION_LABELS: { keys: Permission[]; label: string }[] = [
  { keys: ["products", "inventory"], label: "Products & Inventory" },
  { keys: ["orders"], label: "Orders & Returns" },
  { keys: ["customers"], label: "Customers" },
  { keys: ["discounts", "marketing"], label: "Discounts & Marketing" },
  { keys: ["analytics"], label: "Analytics" },
  { keys: ["settings"], label: "Store Settings" },
  { keys: ["users"], label: "User Management" },
];

/**
 * Which permission(s) unlock each admin page. Having ANY of them is enough.
 * Pages not listed (dashboard, own account security) are open to all staff.
 */
const ROUTE_PERMISSIONS: [prefix: string, perms: Permission[]][] = [
  ["/admin/products", ["products"]],
  ["/admin/cj-dropshipping", ["products"]],
  ["/admin/inventory", ["inventory"]],
  ["/admin/orders", ["orders"]],
  ["/admin/returns", ["orders"]],
  ["/admin/customers", ["customers"]],
  ["/admin/reviews", ["products", "customers"]],
  ["/admin/discounts", ["discounts"]],
  ["/admin/marketing", ["marketing"]],
  ["/admin/articles", ["marketing"]],
  ["/admin/seo", ["marketing"]],
  ["/admin/analytics", ["analytics"]],
  ["/admin/settings", ["settings"]],
  ["/admin/integrations", ["settings"]],
  ["/admin/payments", ["settings"]],
  ["/admin/shipping", ["settings"]],
  ["/admin/users", ["users"]],
];

export function permissionsForPath(pathname: string): Permission[] {
  const match = ROUTE_PERMISSIONS.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  return match ? match[1] : [];
}
