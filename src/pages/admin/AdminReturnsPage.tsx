"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, AlertCircle } from "lucide-react";

const AdminReturnsPage = () => {
  const { returns } = useStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Returns & Refunds</h1>
        <p className="text-slate-500 mt-2 font-medium">Process return requests and manage customer refunds.</p>
      </div>

      {returns.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <RotateCcw size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No return requests</h3>
            <p className="text-slate-500 mt-2">You're all caught up! No pending returns to process.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Returns list would go here */}
        </div>
      )}
    </div>
  );
};

export default AdminReturnsPage;