"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { MarketingCampaign } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Zap, Target, BarChart3, Plus, Trash2, Pencil, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICONS = { email: Target, social: Megaphone, banner: BarChart3 };

const STATUS_STYLES: Record<MarketingCampaign["status"], string> = {
  draft: "bg-slate-100 text-slate-500",
  active: "bg-emerald-50 text-emerald-600",
  paused: "bg-amber-50 text-amber-600",
  ended: "bg-rose-50 text-rose-500",
};

const emptyForm = (): Omit<MarketingCampaign, "id" | "createdAt"> => ({
  name: "",
  type: "email",
  status: "draft",
  startDate: undefined,
  endDate: undefined,
  budget: undefined,
  description: "",
});

const AdminMarketingPage = () => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MarketingCampaign | null>(null);
  const [form, setForm] = useState(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (c: MarketingCampaign) => {
    setEditing(c);
    setForm({
      name: c.name,
      type: c.type,
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
      budget: c.budget,
      description: c.description,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateCampaign({ ...editing, ...form });
    } else {
      addCampaign({
        ...form,
        id: `CAM-${Math.floor(Math.random() * 1000000)}`,
        createdAt: new Date().toISOString(),
      });
    }
    setOpen(false);
  };

  const toggleStatus = (c: MarketingCampaign) => {
    const next: MarketingCampaign["status"] = c.status === "active" ? "paused" : "active";
    updateCampaign({ ...c, status: next });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketing</h1>
          <p className="text-slate-500 mt-2 font-medium">Create campaigns and track their performance across channels.</p>
        </div>
        <Button onClick={openCreate} className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-6">
          <Zap size={16} /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([
          { type: "email" as const, title: "Email Marketing", icon: Target, desc: "Send newsletters and promos" },
          { type: "social" as const, title: "Social Media", icon: Megaphone, desc: "Track social engagement" },
          { type: "banner" as const, title: "Store Banners", icon: BarChart3, desc: "Manage homepage promos" },
        ]).map((item) => {
          const count = campaigns.filter(c => c.type === item.type).length;
          return (
            <Card
              key={item.type}
              onClick={() => { setForm({ ...emptyForm(), type: item.type }); setEditing(null); setOpen(true); }}
              className="border-none shadow-sm rounded-[2rem] hover:shadow-md transition-all cursor-pointer group"
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                  <item.icon size={24} />
                </div>
                <h3 className="font-black text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                {count > 0 && (
                  <Badge className="bg-primary/10 text-primary border-transparent shadow-none text-[9px] font-black">
                    {count} campaign{count > 1 ? "s" : ""}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <h3 className="text-2xl font-black text-slate-900">No active campaigns</h3>
            <p className="text-slate-500 mt-2">Launch your first marketing campaign to reach more customers.</p>
            <Button onClick={openCreate} variant="outline" className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">All Campaigns</CardTitle>
          </CardHeader>
          <div className="divide-y divide-slate-50">
            {campaigns.map(c => {
              const Icon = TYPE_ICONS[c.type];
              return (
                <div key={c.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-slate-900">{c.name}</p>
                        <Badge className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none", STATUS_STYLES[c.status])}>
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                        {c.type}
                        {c.budget ? ` · $${c.budget} budget` : ""}
                        {c.startDate ? ` · Starts ${new Date(c.startDate).toLocaleDateString()}` : ""}
                        {c.endDate ? ` · Ends ${new Date(c.endDate).toLocaleDateString()}` : ""}
                      </p>
                      {c.description && <p className="text-xs text-slate-500 font-medium mt-1">{c.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(c.status === "active" || c.status === "paused" || c.status === "draft") && (
                      <Button variant="ghost" size="icon" onClick={() => toggleStatus(c)} className="rounded-xl text-slate-400 hover:text-slate-700">
                        {c.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)} className="rounded-xl text-slate-400 hover:text-slate-700">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCampaign(c.id)} className="rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">{editing ? "Edit Campaign" : "New Campaign"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Name</Label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Summer Sale Newsletter"
                className="rounded-xl h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as MarketingCampaign["type"] })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="banner">Store Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as MarketingCampaign["status"] })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate ? form.startDate.split("T")[0] : ""}
                  onChange={e => setForm({ ...form, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</Label>
                <Input
                  type="date"
                  value={form.endDate ? form.endDate.split("T")[0] : ""}
                  onChange={e => setForm({ ...form, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="rounded-xl h-12"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget ($)</Label>
              <Input
                type="number"
                value={form.budget ?? ""}
                onChange={e => setForm({ ...form, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="Optional"
                className="rounded-xl h-12"
                min={0}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this campaign..."
                className="rounded-xl resize-none"
                rows={3}
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

export default AdminMarketingPage;
