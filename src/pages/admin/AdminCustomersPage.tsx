"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Customer } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<Customer["status"], string> = {
  VIP: "bg-purple-50 text-purple-700",
  returning: "bg-blue-50 text-blue-700",
  active: "bg-emerald-50 text-emerald-700",
  blocked: "bg-rose-50 text-rose-600",
};

const AdminCustomersPage = () => {
  const { customers } = useStore();
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const vipCount = customers.filter(c => c.status === "VIP").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your customer relationships and view their purchase history.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xl font-black text-slate-900">{customers.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
          </div>
          <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xl font-black text-purple-600">{vipCount}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">VIP</p>
          </div>
          <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xl font-black text-slate-900">${totalRevenue.toFixed(0)}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, or location..."
          className="pl-10 rounded-xl h-12"
        />
      </div>

      {customers.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Users size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No customers yet</h3>
            <p className="text-slate-500 mt-2">Customers will appear here once they place their first order.</p>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-none shadow-sm rounded-2xl">
          <CardContent className="p-16 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-200 mb-4" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No results for "{search}"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(customer => (
            <Card key={customer.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg flex-shrink-0">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-slate-900">{customer.name}</h4>
                        <Badge className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none", STATUS_STYLES[customer.status])}>
                          {customer.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium mt-1.5">
                        <span className="flex items-center gap-1"><Mail size={11} /> {customer.email}</span>
                        {customer.phone && <span className="flex items-center gap-1"><Phone size={11} /> {customer.phone}</span>}
                        {customer.location && <span className="flex items-center gap-1"><MapPin size={11} /> {customer.location}</span>}
                      </div>
                      {customer.tags && customer.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {customer.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-6 text-right flex-shrink-0">
                    <div>
                      <p className="text-lg font-black text-slate-900">${customer.totalSpent.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Spent</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">{customer.totalOrders}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Orders</p>
                    </div>
                    {customer.lastOrderDate && (
                      <div className="hidden sm:block">
                        <p className="text-sm font-black text-slate-700">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Last Order</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
