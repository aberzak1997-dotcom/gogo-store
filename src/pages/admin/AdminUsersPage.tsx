"use client";

import React, { useCallback, useEffect, useState } from "react";
import { UserCog, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Check, Minus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSION_LABELS, ROLES, roleLabel, type Permission, type StaffRole } from "../../lib/permissions";
import { showError, showSuccess } from "../../utils/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StaffUser {
  id: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  last_sign_in_at: string | null;
  created_at: string;
}

type RolePermissionMap = Partial<Record<StaffRole, Partial<Record<Permission, boolean>>>>;

const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
  <Badge
    className={cn(
      "text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none uppercase tracking-widest",
      ROLES.find(r => r.value === role)?.badge ?? "bg-slate-100 text-slate-500"
    )}
  >
    {roleLabel(role)}
  </Badge>
);

const PermissionPreview: React.FC<{ role: StaffRole; map: RolePermissionMap }> = ({ role, map }) => (
  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">This role can access</p>
    <div className="grid grid-cols-2 gap-2">
      {PERMISSION_LABELS.map(p => {
        const ok = role === "super_admin" || p.keys.some(k => map[role]?.[k]);
        return (
          <div key={p.label} className={cn("flex items-center gap-2 text-[12px]", ok ? "text-slate-700 font-medium" : "text-slate-300")}>
            {ok ? <Check size={14} className="text-emerald-500" /> : <Minus size={14} />}
            {p.label}
          </div>
        );
      })}
    </div>
  </div>
);

const AdminUsersPage = () => {
  const { isSuperAdmin, email: myEmail } = usePermissions();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleMap, setRoleMap] = useState<RolePermissionMap>({});

  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<StaffRole>("store_manager");
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [editRole, setEditRole] = useState<StaffRole>("store_manager");
  const [removing, setRemoving] = useState<StaffUser | null>(null);

  const loadUsers = useCallback(async () => {
    if (!supabase) return setLoading(false);
    const { data, error } = await supabase.rpc("admin_list_users");
    if (error) showError(error.message);
    else setUsers((data as StaffUser[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
    supabase
      ?.from("role_permissions")
      .select("role, permissions")
      .then(({ data }) => {
        if (data) setRoleMap(Object.fromEntries(data.map(r => [r.role, r.permissions])));
      });
  }, [loadUsers]);

  const run = async (fn: string, args: Record<string, unknown>, message: string) => {
    if (!supabase) return false;
    setSaving(true);
    const { error } = await supabase.rpc(fn, args);
    setSaving(false);
    if (error) {
      showError(error.message);
      return false;
    }
    showSuccess(message);
    await loadUsers();
    return true;
  };

  const handleAdd = async () => {
    const email = addEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError("Enter a valid email address.");
    if (await run("admin_add_user", { p_email: email, p_role: addRole }, `${email} now has ${roleLabel(addRole)} access.`)) {
      setAddOpen(false);
      setAddEmail("");
    }
  };

  const handleEdit = async () => {
    if (!editing) return;
    if (await run("admin_update_user", { p_user_id: editing.id, p_role: editRole }, "Role updated.")) setEditing(null);
  };

  const toggleActive = (u: StaffUser) =>
    run(
      "admin_update_user",
      { p_user_id: u.id, p_is_active: !u.is_active },
      u.is_active ? `${u.email} deactivated.` : `${u.email} reactivated.`
    );

  const handleRemove = async () => {
    if (!removing) return;
    await run("admin_remove_user", { p_user_id: removing.id }, `${removing.email} no longer has admin access.`);
    setRemoving(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Users & Roles</h1>
          <p className="text-slate-500 mt-2 font-medium">Control who can access the admin dashboard and what they can do.</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setAddOpen(true)} className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-6">
            <Plus size={16} /> Add User
          </Button>
        )}
      </div>

      {/* Role overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES.map(r => (
          <Card key={r.value} className="border-none shadow-sm rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <RoleBadge role={r.value} />
                <span className="text-3xl font-black text-slate-900">
                  {users.filter(u => u.role === r.value && u.is_active).length}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-3">{r.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users */}
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : users.length === 0 ? (
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <UserCog size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No staff users</h3>
            <p className="text-slate-500 mt-2">Add a teammate to give them access to the dashboard.</p>
          </CardContent>
        ) : (
          <div className="divide-y divide-slate-50">
            {users.map(u => {
              const isMe = u.email.toLowerCase() === myEmail?.toLowerCase();
              return (
                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#1528A1]/10 text-[#1528A1] flex items-center justify-center font-black flex-shrink-0">
                      {u.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-slate-900 truncate">{u.email}</p>
                        {isMe && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">You</span>}
                        <RoleBadge role={u.role} />
                        {!u.is_active && (
                          <Badge className="text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none bg-rose-50 text-rose-500">
                            Deactivated
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                        Last sign-in {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "never"}
                        {" · "}Added {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {isSuperAdmin && !isMe && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={u.is_active ? "Deactivate" : "Reactivate"}
                        disabled={saving}
                        onClick={() => toggleActive(u)}
                        className="rounded-xl text-slate-400 hover:text-slate-700"
                      >
                        {u.is_active ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Change role"
                        onClick={() => {
                          setEditing(u);
                          setEditRole(u.role);
                        }}
                        className="rounded-xl text-slate-400 hover:text-slate-700"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Remove admin access"
                        onClick={() => setRemoving(u)}
                        className="rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add user */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">Add User</DialogTitle>
            <DialogDescription>
              The person needs a WIVITEC account first (storefront sign-up or Google sign-in). They'll be asked to set up 2FA on their first admin sign-in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</Label>
              <Input
                type="email"
                value={addEmail}
                onChange={e => setAddEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="name@wivitec.com"
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role</Label>
              <Select value={addRole} onValueChange={v => setAddRole(v as StaffRole)}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <PermissionPreview role={addRole} map={roleMap} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAdd} disabled={saving} className="rounded-xl font-black uppercase tracking-widest text-[10px]">
              {saving ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change role */}
      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">Change Role</DialogTitle>
            <DialogDescription>{editing?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setEditRole(r.value)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-colors",
                  editRole === r.value ? "border-[#1528A1] bg-[#1528A1]/5" : "border-slate-100 hover:bg-slate-50"
                )}
              >
                <div>
                  <RoleBadge role={r.value} />
                  <p className="text-[12px] text-slate-500 mt-1.5">{r.description}</p>
                </div>
                {editRole === r.value && <Check size={18} className="text-[#1528A1]" />}
              </button>
            ))}
            <PermissionPreview role={editRole} map={roleMap} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleEdit}
              disabled={saving || editRole === editing?.role}
              className="rounded-xl font-black uppercase tracking-widest text-[10px]"
            >
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove access */}
      <AlertDialog open={!!removing} onOpenChange={open => !open && setRemoving(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove admin access?</AlertDialogTitle>
            <AlertDialogDescription>
              {removing?.email} will lose access to the admin dashboard. Their customer account and order history are kept, and you can add them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="rounded-xl bg-rose-500 hover:bg-rose-600">
              Remove access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsersPage;
