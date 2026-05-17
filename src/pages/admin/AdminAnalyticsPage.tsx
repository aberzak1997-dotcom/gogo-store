"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 mt-2 font-medium">Deep dive into your store's performance and customer behavior.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Conversion Rate", value: "3.2%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Avg. Order Value", value: "$124.50", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Customer Retention", value: "24%", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Return Rate", value: "1.5%", icon: ShoppingBag, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem]">
            <CardContent className="p-8">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.title}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <CardTitle className="text-xl font-black">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <BarChart3 size={40} />
          </div>
          <p className="text-slate-500 font-medium">Detailed charts and reports will appear here as your store grows.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;