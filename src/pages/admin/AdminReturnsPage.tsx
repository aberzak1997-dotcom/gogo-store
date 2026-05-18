import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Package, 
  DollarSign,
  AlertCircle,
  Clock,
  User,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReturnRequest } from "../../types";

const AdminReturnsPage = () => {
  const { returns, updateReturnStatus } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailReturn, setDetailReturn] = useState<null | ReturnRequest>(null);

  const filteredReturns = useMemo(() => {
    let result = [...returns];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        r.id.toLowerCase().includes(s) ||
        r.orderId.toLowerCase().includes(s) ||
        r.customerName.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(r => r.status === statusFilter);
    }

    return result;
  }, [returns, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      requested: { color: "bg-amber-100 text-amber-700", label: "Requested" },
      approved: { color: "bg-blue-100 text-blue-700", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
      received: { color: "bg-indigo-100 text-indigo-700", label: "Received" },
      refunded: { color: "bg-emerald-100 text-emerald-700", label: "Refunded" },
    };
    const cfg = map[status] || map.requested;
    return <Badge className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-full", cfg.color)}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Returns & Refunds</h1>
        <p className="text-slate-500 mt-2 font-medium">Process return requests and manage customer refunds.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by return ID, order ID, or customer..."
              className="pl-10 rounded-xl h-12"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-xl h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 h-16">
                <TableHead className="pl-8">Return ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Refund Amount</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-slate-400 font-medium">
                    No return requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReturns.map(ret => (
                  <TableRow key={ret.id} className="hover:bg-slate-50/50 transition-colors h-20">
                    <TableCell className="pl-8 font-black text-xs text-slate-900">{ret.id}</TableCell>
                    <TableCell className="font-bold text-xs text-slate-500">{ret.orderId}</TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">{ret.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{ret.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-500">{ret.reason}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(ret.status)}</TableCell>
                    <TableCell className="font-black text-slate-900">${ret.refundAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setDetailReturn(ret)}
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

      {/* Return Details Modal */}
      <Dialog open={!!detailReturn} onOpenChange={open => !open && setDetailReturn(null)}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 border-none shadow-2xl">
          {detailReturn && (
            <div className="flex flex-col">
              <div className="bg-slate-900 p-10 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black tracking-tight">{detailReturn.id}</h2>
                  {getStatusBadge(detailReturn.status)}
                </div>
                <p className="text-slate-400 font-medium">Requested on {new Date(detailReturn.requestedAt).toLocaleString()}</p>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Info</h3>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900">{detailReturn.customerName}</p>
                      <p className="text-xs text-slate-500">{detailReturn.email}</p>
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Order: {detailReturn.orderId}</p>
                    </div>
                  </section>
                  <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Return Reason</h3>
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <AlertCircle size={16} />
                      <span className="text-xs font-bold">{detailReturn.reason}</span>
                    </div>
                  </section>
                </div>

                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Items to Return</h3>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <Table>
                      <TableBody>
                        {detailReturn.items.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-bold text-slate-900">{item.title}</TableCell>
                            <TableCell className="text-center font-medium">x{item.quantity}</TableCell>
                            <TableCell className="text-right font-black">${item.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {detailReturn.status === "requested" && (
                      <>
                        <Button 
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 gap-2 font-bold text-xs"
                          onClick={() => updateReturnStatus(detailReturn.id, "approved")}
                        >
                          <CheckCircle2 size={14} /> Approve Return
                        </Button>
                        <Button 
                          variant="outline"
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 gap-2 font-bold text-xs"
                          onClick={() => updateReturnStatus(detailReturn.id, "rejected")}
                        >
                          <XCircle size={14} /> Reject Return
                        </Button>
                      </>
                    )}
                    {detailReturn.status === "approved" && (
                      <Button 
                        className="col-span-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold text-xs"
                        onClick={() => updateReturnStatus(detailReturn.id, "received")}
                      >
                        <Package size={14} /> Mark as Received
                      </Button>
                    )}
                    {detailReturn.status === "received" && (
                      <Button 
                        className="col-span-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 gap-2 font-bold text-xs"
                        onClick={() => updateReturnStatus(detailReturn.id, "refunded")}
                      >
                        <DollarSign size={14} /> Process Refund (${detailReturn.refundAmount.toFixed(2)})
                      </Button>
                    )}
                  </div>
                </section>
              </div>

              <DialogFooter className="p-10 bg-slate-50 border-t border-slate-100">
                <Button variant="outline" className="rounded-xl font-bold" onClick={() => setDetailReturn(null)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReturnsPage;