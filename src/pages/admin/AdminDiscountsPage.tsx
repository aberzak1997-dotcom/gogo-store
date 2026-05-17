"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDiscountsPage = () => {
  const { discounts } = useStore();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Discounts</h1>
          <p className="text-slate-500 mt-2 font-medium">Create and manage discount codes to drive more sales.</p>
        </div>
        <Button className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-6">
          <Plus size={16} /> Create Discount
        </Button>
      </div>

      {discounts.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Tag size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No active discounts</h3>
            <p className="text-slate-500 mt-2">Start by creating your first promotional code.</p>
            <Button variant="outline" className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
              Learn about discounts
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Discount list would go here */}
        </div>
      )}
    </div>
  );
};

export default AdminDiscountsPage;