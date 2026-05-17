"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Globe, Mail, Shield, Bell, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const AdminSettingsPage = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">Configure your store's general settings and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Globe size={20} className="text-primary" /> General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Name</Label>
                  <Input 
                    value={formData.storeName} 
                    onChange={e => setFormData({...formData, storeName: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</Label>
                  <Input 
                    value={formData.contactEmail} 
                    onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Currency</Label>
                  <Input 
                    value={formData.currency} 
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tax Rate (%)</Label>
                  <Input 
                    type="number"
                    value={formData.taxRate * 100} 
                    onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value) / 100})}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Shield size={20} className="text-primary" /> Store Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-black text-slate-900">Maintenance Mode</p>
                  <p className="text-xs text-slate-500 font-medium">Temporarily disable the storefront for customers.</p>
                </div>
                <Switch 
                  checked={formData.maintenanceMode} 
                  onCheckedChange={checked => setFormData({...formData, maintenanceMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="rounded-full h-14 px-12 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { title: "Notifications", icon: Bell, desc: "Manage email alerts" },
            { title: "Payments", icon: CreditCard, desc: "Configure gateways" },
            { title: "Security", icon: Shield, desc: "Password & access" },
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;