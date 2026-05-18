"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Mail, Phone, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { calculateCustomerStatus } from "../../types";

const AdminCustomersPage = () => {
 const { customers } = useStore();

 return (
 <div className="space-y-8">
 <div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customers</h1>
 <p className="text-slate-500 mt-2 font-medium">Manage your customer relationships and view their purchase history.</p>
 </div>

 <div className="relative max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
 <Input placeholder="Search customers..." className="pl-10 rounded-xl" />
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
 ) : (
 <div className="grid gap-4">
 {customers.map(customer => (
 <Card key={customer.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
 <CardContent className="p-6 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
 {customer.name.charAt(0)}
 </div>
 <div>
 <h4 className="font-black text-slate-900">{customer.name}</h4>
 <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
 <span className="flex items-center gap-1"><Mail size={12} /> {customer.email}</span>
 {customer.phone && <span className="flex items-center gap-1"><Phone size={12} /> {customer.phone}</span>}
 </div>
 </div>
 </div>
 <div className="text-right">
 <p className="text-sm font-black text-slate-900">${customer.totalSpent.toFixed(2)}</p>
 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{customer.totalOrders} Orders</p>
 <p className="text-sm text-slate-400 font-medium mt-1">
 {calculateCustomerStatus(customer)}
 </p>
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