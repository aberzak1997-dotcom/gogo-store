"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Discount } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const emptyForm = (): Omit<Discount, "id" | "createdAt" | "usedCount"> => ({
  code: "",
  type: "percentage",
  value: 10,
  minOrderAmount: undefined,
  maxUses: undefined,
  expiresAt: undefined,
  isActive: true,
});

const AdminDiscountsPage = () => {
  const { discounts, addDiscount, updateDiscount, deleteDiscount } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (d: Discount) => {
    setEditing(d);
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      minOrderAmount: d.minOrderAmount,
      maxUses: d.maxUses,
      expiresAt: d.expiresAt,
      isActive: d.isActive,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.code.trim() || form.value <= 0) return;
    if (editing) {
      updateDiscount({ ...editing, ...form });
    } else {
      addDiscount({
        ...form,
        id: `DISC-${Math.floor(Math.random() * 1000000)}`,
        usedCount: 0,
        createdAt: new Date().toISOString(),
      });
    }
    setOpen(false);
  };

  const toggle = (d: Discount) => updateDiscount({ ...d, isActive: !d.isActive });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Discounts</h1>
          <p className="text-slate-500 mt-2 font-medium">Create and manage discount codes to drive more sales.</p>
        </div>
        <Button onClick={openCreate} className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-6">
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
            <Button onClick={openCreate} variant="outline" className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
              Create your first discount
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
          <div className="divide-y divide-slate-50">
            {discounts.map(d => (
              <div key={d.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0033CC]/10 text-[#0033CC] flex items-center justify-center">
                    <Tag size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900 font-mono tracking-widest">{d.code}</p>
                      <Badge className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none", d.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                        {d.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                      {d.type === "percentage" ? `${d.value}% off` : `$${d.value} off`}
                      {d.minOrderAmount ? ` · Min $${d.minOrderAmount}` : ""}
                      {d.maxUses ? ` · ${d.usedCount}/${d.maxUses} used` : ` · ${d.usedCount} used`}
                      {d.expiresAt ? ` · Expires ${new Date(d.expiresAt).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggle(d)} className="rounded-xl text-slate-400 hover:text-slate-700">
                    {d.isActive ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(d)} className="rounded-xl text-slate-400 hover:text-slate-700">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteDiscount(d.id)} className="rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">{editing ? "Edit Discount" : "Create Discount"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Code</Label>
              <Input
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SUMMER20"
                className="rounded-xl h-12 font-mono tracking-widest"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as Discount["type"] })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Value</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={e => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                  className="rounded-xl h-12"
                  min={0}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min. Order ($)</Label>
                <Input
                  type="number"
                  value={form.minOrderAmount ?? ""}
                  onChange={e => setForm({ ...form, minOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="Optional"
                  className="rounded-xl h-12"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Max Uses</Label>
                <Input
                  type="number"
                  value={form.maxUses ?? ""}
                  onChange={e => setForm({ ...form, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Unlimited"
                  className="rounded-xl h-12"
                  min={1}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expiry Date</Label>
              <Input
                type="date"
                value={form.expiresAt ? form.expiresAt.split("T")[0] : ""}
                onChange={e => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="rounded-xl h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl font-black uppercase tracking-widest text-[10px]">
              {editing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDiscountsPage;
