import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShoppingBag, Eye, CheckCircle, XCircle, Search, Filter, ArrowUpDown, RefreshCcw } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useStore();

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [detailOrder, setDetailOrder] = useState<null | typeof orders[0]>(null);
  const [statusEdit, setStatusEdit] = useState<string>("");

  // Filtering & sorting
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.email.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(o => o.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "total-high") return b.totalAmount - a.totalAmount;
      if (sortBy === "total-low") return a.totalAmount - b.totalAmount;
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, sortBy]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-amber-100 text-amber-700", label: "Pending" },
      shipped: { color: "bg-green-100 text-green-700", label: "Shipped" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
    };
    const cfg = map[status] || map.pending;
    return <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</Badge>;
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    setDetailOrder(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <Button variant="ghost" size="icon" onClick={() => setSearch("")}>
            <RefreshCcw size={20} />
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="total-high">Total High → Low</SelectItem>
                  <SelectItem value="total-low">Total Low → High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    No orders match your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map(order => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{order.items.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDetailOrder(order);
                            setStatusEdit(order.status);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Detail Modal */}
        <Dialog open={!!detailOrder} onOpenChange={open => !open && setDetailOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details – {detailOrder?.id}</DialogTitle>
              <DialogDescription>
                Review items and update status if needed.
              </DialogDescription>
            </DialogHeader>
            {detailOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Customer</p>
                    <p>{detailOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{detailOrder.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{new Date(detailOrder.date).toLocaleString()}</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-medium mb-2">Items</p>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailOrder.items.map(item => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">Total: ${detailOrder.totalAmount.toFixed(2)}</p>
                  <Select value={statusEdit} onValueChange={setStatusEdit}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDetailOrder(null)}>Close</Button>
              {detailOrder && (
                <Button
                  onClick={() => handleStatusChange(detailOrder.id, statusEdit)}
                >
                  Save Status
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;