import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "../../hooks/usePermissions";
import type { Permission } from "../../lib/permissions";

interface PermissionGuardProps {
  /** Access is granted when the user has ANY of these (empty = all staff) */
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ permissions, children, fallback }) => {
  const { canAny, loading } = usePermissions();

  if (permissions.length === 0) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!canAny(permissions)) {
    if (fallback) return <>{fallback}</>;
    return (
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Lock size={36} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Access restricted</h3>
          <p className="text-slate-500 mt-2">Your role doesn't include this section. Ask a Super Admin if you need access.</p>
          <Button asChild variant="outline" className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
            <Link to="/admin">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
