"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Truck, Plus, Trash2, Pencil, Globe, Package, Zap, CheckCircle2, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  flatRate: number;
  expressRate?: number;
  freeThreshold?: number;
  enabled: boolean;
}

const SAVED_ZONES = localStorage.getItem("shipping_zones");
const DEFAULT_ZONES: ShippingZone[] = SAVED_ZONES ? JSON.parse(SAVED_ZONES) : [
  { id: "z1", name: "Domestic", countries: ["United States", "Canada"], flatRate: 9.99, expressRate: 24.99, freeThreshold: 50, enabled: true },
  { id: "z2", name: "Europe", countries: ["United Kingdom", "Germany", "France", "Spain", "Italy"], flatRate: 19.99, expressRate: 39.99, enabled: true },
  { id: "z3", name: "Rest of World", countries: ["Australia", "Japan", "Brazil", "Other"], flatRate: 29.99, enabled: true },
];

const COUNTRY_LIST = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Spain", "Italy",
  "Netherlands", "Australia", "Japan", "Brazil", "Mexico", "India", "South Africa",
  "UAE", "Saudi Arabia", "Singapore", "New Zealand", "Sweden", "Norway", "Denmark",
];

const emptyZone = (): Omit<ShippingZone, "id"> => ({
  name: "", countries: [], flatRate: 9.99, expressRate: undefined, freeThreshold: undefined, enabled: true,
});

const AdminShippingPage = () => {
  const { settings, updateSettings } = useStore();
  const [zones, setZones] = useState<ShippingZone[]>(DEFAULT_ZONES);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingZone | null>(null);
  const [form, setForm] = useState(emptyZone());
  const [countryInput, setCountryInput] = useState("");
  const [freeThreshold, setFreeThreshold] = useState(settings.freeShippingThreshold);
  const [saved, setSaved] = useState(false);

  const saveZones = (updated: ShippingZone[]) => {
    setZones(updated);
    localStorage.setItem("shipping_zones", JSON.stringify(updated));
  };

  const handleSave = () => {
    updateSettings({ ...settings, freeShippingThreshold: freeThreshold });
    localStorage.setItem("shipping_zones", JSON.stringify(zones));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyZone());
    setCountryInput("");
    setOpen(true);
  };

  const openEdit = (z: ShippingZone) => {
    setEditing(z);
    setForm({ name: z.name, countries: [...z.countries], flatRate: z.flatRate, expressRate: z.expressRate, freeThreshold: z.freeThreshold, enabled: z.enabled });
    setCountryInput("");
    setOpen(true);
  };

  const handleZoneSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      saveZones(zones.map(z => z.id === editing.id ? { ...editing, ...form } : z));
    } else {
      saveZones([...zones, { ...form, id: `z${Date.now()}` }]);
    }
    setOpen(false);
  };

  const deleteZone = (id: string) => saveZones(zones.filter(z => z.id !== id));
  const toggleZone = (z: ShippingZone) => saveZones(zones.map(z2 => z2.id === z.id ? { ...z2, enabled: !z2.enabled } : z2));

  const addCountry = (country: string) => {
    if (country && !form.countries.includes(country)) {
      setForm({ ...form, countries: [...form.countries, country] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shipping</h1>
          <p className="text-slate-500 mt-2 font-medium">Define shipping zones, rates, and delivery options.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={openCreate} variant="outline" className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-5">
            <Plus size={14} /> Add Zone
          </Button>
          <Button onClick={handleSave} className={cn("rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 transition-all", saved && "bg-emerald-500 hover:bg-emerald-600")}>
            {saved ? <><CheckCircle2 size={14} className="mr-2" /> Saved!</> : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Global shipping settings */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={16} /></div>
            Global Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Free Shipping Threshold ($)</Label>
              <Input
                type="number"
                value={freeThreshold}
                onChange={e => setFreeThreshold(parseFloat(e.target.value) || 0)}
                className="rounded-xl h-12"
                min={0}
              />
              <p className="text-[10px] text-slate-400 font-medium">Orders above this amount get free shipping</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processing Time</Label>
              <Select defaultValue="1-2">
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">Same day</SelectItem>
                  <SelectItem value="1-2">1-2 business days</SelectItem>
                  <SelectItem value="3-5">3-5 business days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carrier</Label>
              <Select defaultValue="any">
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any available</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Zones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping Zones ({zones.length})</h2>
        </div>

        {zones.length === 0 ? (
          <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-16 text-center">
              <Globe className="mx-auto h-12 w-12 text-slate-100 mb-4" />
              <h3 className="font-black text-slate-900">No shipping zones</h3>
              <p className="text-slate-500 mt-1 text-sm">Add zones to define where you ship and at what rate.</p>
              <Button onClick={openCreate} variant="outline" className="mt-6 rounded-xl font-black uppercase tracking-widest text-[10px]">
                Add First Zone
              </Button>
            </CardContent>
          </Card>
        ) : (
          zones.map(zone => (
            <Card key={zone.id} className={cn("border shadow-sm rounded-2xl transition-all", zone.enabled ? "border-slate-100 bg-white" : "border-slate-100 bg-slate-50/60 opacity-70")}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-[#0096D6]/10 text-[#0096D6] flex items-center justify-center flex-shrink-0">
                      <Globe size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900">{zone.name}</h3>
                        <Badge className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none", zone.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                          {zone.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {zone.countries.slice(0, 5).map(c => (
                          <span key={c} className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                        {zone.countries.length > 5 && (
                          <span className="text-[9px] font-black text-slate-400">+{zone.countries.length - 5} more</span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Truck size={13} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">Standard: ${zone.flatRate.toFixed(2)}</span>
                        </div>
                        {zone.expressRate && (
                          <div className="flex items-center gap-1.5">
                            <Zap size={13} className="text-amber-500" />
                            <span className="text-xs font-bold text-slate-700">Express: ${zone.expressRate.toFixed(2)}</span>
                          </div>
                        )}
                        {zone.freeThreshold && (
                          <div className="flex items-center gap-1.5">
                            <Package size={13} className="text-emerald-500" />
                            <span className="text-xs font-bold text-slate-700">Free over ${zone.freeThreshold}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch checked={zone.enabled} onCheckedChange={() => toggleZone(zone)} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(zone)} className="rounded-xl text-slate-400 hover:text-slate-700">
                      <Pencil size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteZone(zone.id)} className="rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Zone Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">{editing ? "Edit Zone" : "New Shipping Zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zone Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. North America" className="rounded-xl h-12" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Countries</Label>
              <Select onValueChange={addCountry}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder="Select a country..." />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_LIST.filter(c => !form.countries.includes(c)).map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.countries.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.countries.map(c => (
                    <button
                      key={c}
                      onClick={() => setForm({ ...form, countries: form.countries.filter(x => x !== c) })}
                      className="text-[9px] font-black uppercase tracking-wider bg-[#0096D6]/10 text-[#0096D6] px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    >
                      {c} ×
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Standard Rate ($)</Label>
                <Input type="number" value={form.flatRate} onChange={e => setForm({ ...form, flatRate: parseFloat(e.target.value) || 0 })} className="rounded-xl h-12" min={0} step={0.01} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Express Rate ($)</Label>
                <Input type="number" value={form.expressRate ?? ""} onChange={e => setForm({ ...form, expressRate: e.target.value ? parseFloat(e.target.value) : undefined })} placeholder="Optional" className="rounded-xl h-12" min={0} step={0.01} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Free Shipping Threshold ($)</Label>
              <Input type="number" value={form.freeThreshold ?? ""} onChange={e => setForm({ ...form, freeThreshold: e.target.value ? parseFloat(e.target.value) : undefined })} placeholder="Leave blank to use global threshold" className="rounded-xl h-12" min={0} step={0.01} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleZoneSave} className="rounded-xl font-black uppercase tracking-widest text-[10px]">
              {editing ? "Save Changes" : "Create Zone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShippingPage;
