"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Zap, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminMarketingPage = () => {
  const { campaigns } = useStore();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketing</h1>
          <p className="text-slate-500 mt-2 font-medium">Create campaigns and track their performance across channels.</p>
        </div>
        <Button className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-6">
          <Zap size={16} /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Email Marketing", icon: Target, desc: "Send newsletters and promos" },
          { title: "Social Media", icon: Megaphone, desc: "Track social engagement" },
          { title: "Store Banners", icon: BarChart3, desc: "Manage homepage promos" },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="font-black text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <h3 className="text-2xl font-black text-slate-900">No active campaigns</h3>
            <p className="text-slate-500 mt-2">Launch your first marketing campaign to reach more customers.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMarketingPage;