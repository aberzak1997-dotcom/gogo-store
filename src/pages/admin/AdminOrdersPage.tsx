import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Search, 
  ArrowUpDown, 
  RefreshCcw, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Download,
  Clock,
  FileText,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "../../types";

const AdminOrdersPage = () => {
  const {
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    updateFulfillmentStatus,
    addOrderNote
  } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [detailOrder, setDetailOrder] = useState<null | Order>(null);

  // Editable status states for the detail modal
  const [orderStatusEdit, setOrderStatusEdit] = useState("");
  const [paymentStatusEdit, setPaymentStatusEdit] = useState("");
  const [fulfillmentStatusEdit, setFulfillmentStatusEdit] = useState("");

  const [internalNote, setInternalNote] = useState("");

  const openDetail = (order: Order) => {
    setDetailOrder(order);
    setOrderStatusEdit(order.status);
    setPaymentStatusEdit(order.paymentStatus);
    setFulfillmentStatusEdit(order.fulfillmentStatus);
    setInternalNote(order.internalNotes || "");
  };

  const handleApplyStatus = () => {
    if (!detailOrder) return;
    updateOrderStatus(detailOrder.id, orderStatusEdit);
    setDetailOrder(prev => prev ? { ...prev, status: orderStatusEdit } : null);
  };

  const handleApplyPayment = () => {
    if (!detailOrder) return;
    updatePaymentStatus(detailOrder.id, paymentStatusEdit);
    setDetailOrder(prev => prev ? { ...prev, paymentStatus: paymentStatusEdit } : null);
  };

  const handleApplyFulfillment = () => {
    if (!detailOrder) return;
    updateFulfillmentStatus(detailOrder.id, fulfillmentStatusEdit);
    setDetailOrder(prev => prev ? { ...prev, fulfillmentStatus: fulfillmentStatusEdit } : null);
  };

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

    if (statusFilter !== "all") result = result.filter(o => o.status === statusFilter);
    if (paymentFilter !== "all") result = result.filter(o => o.paymentStatus === paymentFilter);
    if (fulfillmentFilter !== "all") result = result.filter(o => o.fulfillmentStatus === fulfillmentFilter);

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "total-high") return b.totalAmount - a.totalAmount;
      if (sortBy === "total-low") return a.totalAmount - b.totalAmount;
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, paymentFilter, fulfillmentFilter, sortBy]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-amber-100 text-amber-700", label: "Pending" },
      paid: { color: "bg-blue-100 text-blue-700", label: "Paid" },
      processing: { color: "bg-indigo-100 text-indigo-700", label: "Processing" },
      confirmed: { color: "bg-teal-100 text-teal-700", label: "Confirmed" },
      packed: { color: "bg-purple-100 text-purple-700", label: "Packed" },
      shipped: { color: "bg-blue-100 text-blue-700", label: "Shipped" },
      delivered: { color: "bg-emerald-100 text-emerald-700", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
      refunded: { color: "bg-slate-100 text-slate-700", label: "Refunded" },
    };
    const cfg = map[status] || map.pending;
    return <Badge className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-full", cfg.color)}>{cfg.label}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      unpaid: { color: "bg-slate-100 text-slate-500", label: "Unpaid" },
      paid: { color: "bg-emerald-100 text-emerald-700", label: "Paid" },
      partially_refunded: { color: "bg-amber-100 text-amber-700", label: "Partially Refunded" },
      refunded: { color: "bg-red-100 text-red-700", label: "Refunded" },
    };
    const cfg = map[status] || map.unpaid;
    return <Badge variant="outline" className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-full border-none", cfg.color)}>{cfg.label}</Badge>;
  };

  const getFulfillmentBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      unfulfilled: { color: "bg-slate-100 text-slate-500", label: "Unfulfilled" },
      partially_fulfilled: { color: "bg-amber-100 text-amber-700", label: "Partially Fulfilled" },
      fulfilled: { color: "bg-emerald-100 text-emerald-700", label: "Fulfilled" },
    };
    const cfg = map[status] || map.unfulfilled;
    return <Badge variant="outline" className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-full border-none", cfg.color)}>{cfg.label}</Badge>;
  };

  const handleSaveInternalNote = () => {
    if (detailOrder) {
      addOrderNote(detailOrder.id, internalNote, true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage customer orders, payments, and fulfillment.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2 font-bold text-xs">
            <Download size={16} /> Export
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSearch("")}>
            <RefreshCcw size={20} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              className="pl-10 rounded-xl h-12"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl h-12">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[140px] rounded-xl h-12">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
              <SelectTrigger className="w-[140px] rounded-xl h-12">
                <SelectValue placeholder="Fulfillment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fulfillment</SelectItem>
                <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] rounded-xl h-12">
                <ArrowUpDown className="h-3 w-3 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="total-high">Total: High to Low</SelectItem>
                <SelectItem value="total-low">Total: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 h-16">
                <TableHead className="pl-8">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20 text-slate-400 font-medium">
                    No orders found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map(order => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors h-20">
                    <TableCell className="pl-8 font-black text-xs text-slate-900">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{order.email}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                    <TableCell>{getFulfillmentBadge(order.fulfillmentStatus)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-black text-slate-900">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => openDetail(order)}
                      >
                        <Eye size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!detailOrder} onOpenChange={open => !open && setDetailOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-0 border-none shadow-2xl">
          {detailOrder && (
            <div className="flex flex-col">
              {/* Header */}
              <div className="bg-slate-900 p-10 text-white">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-black tracking-tight">{detailOrder.id}</h2>
                      {getStatusBadge(detailOrder.status)}
                    </div>
                    <p className="text-slate-400 font-medium">Placed on {new Date(detailOrder.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl gap-2 font-bold text-xs">
                      <Printer size={16} /> Print Invoice
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Payment Status</p>
                    {getPaymentBadge(detailOrder.paymentStatus)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Fulfillment Status</p>
                    {getFulfillmentBadge(detailOrder.fulfillmentStatus)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Amount</p>
                    <p className="text-2xl font-black">${detailOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="p-10 grid lg:grid-cols-3 gap-10">
                {/* Left Column: Items & Timeline */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Items */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
                      <Package size={18} className="text-primary" /> Order Items
                    </h3>
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-100/50">
                            <TableHead className="pl-6">Product</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right pr-6">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(detailOrder.items || []).map((item, i) => (
                            <TableRow key={i}>
                              <TableCell className="pl-6 font-bold text-slate-900">{item.title}</TableCell>
                              <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                              <TableCell className="text-right pr-6 font-black">${item.price.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </section>

                  {/* Timeline */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
                      <Clock size={18} className="text-primary" /> Order Timeline
                    </h3>
                    <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-2">
                      {(detailOrder.timeline || []).map((event, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{event.status}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{new Date(event.date).toLocaleString()}</p>
                            {event.note && <p className="text-xs text-slate-500 mt-1 italic">"{event.note}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Customer & Actions */}
                <div className="space-y-10">
                  {/* Customer Info */}
                  <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                      <User size={16} className="text-primary" /> Customer
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</p>
                        <p className="text-sm font-bold text-slate-900">{detailOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                        <p className="text-sm font-bold text-slate-900">{detailOrder.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Address</p>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                          {detailOrder.address}<br />
                          {detailOrder.city}, {detailOrder.country}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Update Status */}
                  <section className="space-y-5 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                      <RefreshCcw size={14} className="text-primary" /> Update Status
                    </h3>

                    {/* Order Status */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Status</p>
                      <div className="flex gap-2">
                        <Select value={orderStatusEdit} onValueChange={setOrderStatusEdit}>
                          <SelectTrigger className="flex-1 rounded-xl bg-white h-10 text-xs font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="packed">Packed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          className="rounded-xl bg-slate-900 hover:bg-primary text-white font-bold text-xs px-4"
                          onClick={handleApplyStatus}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Status</p>
                      <div className="flex gap-2">
                        <Select value={paymentStatusEdit} onValueChange={setPaymentStatusEdit}>
                          <SelectTrigger className="flex-1 rounded-xl bg-white h-10 text-xs font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          className="rounded-xl bg-slate-900 hover:bg-primary text-white font-bold text-xs px-4"
                          onClick={handleApplyPayment}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Fulfillment Status */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fulfillment</p>
                      <div className="flex gap-2">
                        <Select value={fulfillmentStatusEdit} onValueChange={setFulfillmentStatusEdit}>
                          <SelectTrigger className="flex-1 rounded-xl bg-white h-10 text-xs font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                            <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          className="rounded-xl bg-slate-900 hover:bg-primary text-white font-bold text-xs px-4"
                          onClick={handleApplyFulfillment}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Cancel shortcut */}
                    {detailOrder.status !== "cancelled" && detailOrder.status !== "delivered" && (
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 gap-2 font-bold text-xs"
                        onClick={() => {
                          updateOrderStatus(detailOrder.id, "cancelled");
                          setOrderStatusEdit("cancelled");
                          setDetailOrder(prev => prev ? { ...prev, status: "cancelled" } : null);
                        }}
                      >
                        <XCircle size={14} /> Cancel Order
                      </Button>
                    )}
                  </section>

                  {/* Internal Notes */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                      <FileText size={16} className="text-primary" /> Internal Notes
                    </h3>
                    <textarea
                      className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Add a private note for the team..."
                      value={internalNote}
                      onChange={e => setInternalNote(e.target.value)}
                    />
                    <Button 
                      variant="secondary" 
                      className="w-full rounded-xl font-bold text-xs"
                      onClick={handleSaveInternalNote}
                    >
                      Save Note
                    </Button>
                  </section>
                </div>
              </div>

              <DialogFooter className="p-10 bg-slate-50 border-t border-slate-100">
                <Button variant="outline" className="rounded-xl font-bold" onClick={() => setDetailOrder(null)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersPage;