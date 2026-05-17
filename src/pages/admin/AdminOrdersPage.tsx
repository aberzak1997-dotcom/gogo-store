import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Eye, CheckCircle, XCircle } from "lucide-react";

const AdminOrdersPage = () => {
  const { orders } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon"><LayoutDashboard size={20} /></Button>
            </Link>
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-bold">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                        order.status === 'shipped' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                          <CheckCircle size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <XCircle size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;