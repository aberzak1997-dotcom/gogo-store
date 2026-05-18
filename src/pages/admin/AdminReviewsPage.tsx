import { Select, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

...

// Rating filter
<label className="block text-xs font-medium text-slate-900 mb-1">Rating</label>
<Select value={ratingFilter} onValueChange={handleRatingChange} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
  <SelectItem value={0}>All Ratings</SelectItem>
  <SelectItem value={1}>1 Star</SelectItem>
  <SelectItem value={2}>2 Stars</SelectItem>
  <SelectItem value={2.5}>2.5 Stars</SelectItem>
  <SelectItem value={3}>3 Stars</SelectItem>
  <SelectItem value={4}>4 Stars</SelectItem>
  <SelectItem value={5}>5 Stars</SelectItem>
</Select>

// Status filter
<label className="block text-xs font-medium text-slate-900 mb-1">Status</label>
<Select value={statusFilter} onValueChange={handleStatusChange} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus<dyad-write path="src/pages/admin/AdminReviewsPage.tsx" description="Finish Select implementation and fix status comparison.">
import { Select, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

...

// Rating filter
<label className="block text-xs font-medium text-slate-900 mb-1">Rating</label>
<Select value={ratingFilter} onValueChange={handleRatingChange} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
  <SelectItem value={0}>All Ratings</SelectItem>
  <SelectItem value={1}>1 Star</SelectItem>
  <SelectItem value={2}>2 Stars</SelectItem>
  <SelectItem value={2.5}>2.5 Stars</SelectItem>
  <SelectItem value={3}>3 Stars</SelectItem>
  <SelectItem value={4}>4 Stars</SelectItem>
  <SelectItem value={5}>5 Stars</SelectItem>
</Select>

// Status filter
<label className="block text-xs font-medium text-slate-900 mb-1">Status</label>
<Select value={statusFilter} onValueChange={handleStatusChange} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
  <SelectItem value="all">All Statuses</SelectItem>
  <SelectItem value="pending">Pending</SelectItem>
  <SelectItem value="processing">Processing</SelectItem>
  <SelectItem value="shipped">Shipped</SelectItem>
  <SelectItem value="delivered">Delivered</SelectItem>
  <SelectItem value="cancelled">Cancelled</SelectItem>
  <SelectItem value="refunded">Refunded</SelectItem>
  <SelectItem value="approved">Approved</SelectItem>
  <SelectItem value="rejected">Rejected</SelectItem>
</Select>

...

// Badge with class merging
<span className="text-sm font-medium text-slate-900">{review.rating}</span>
<Badge className={cn(
  "text-[10px] uppercase font-black px-2 py-0.5 rounded",
  review.status === "approved" ? "bg-emerald-100 text-emerald-700" :
  review.status === "rejected" ? "bg-red-100 text-red-700" :
  "bg-amber-100 text-amber-700"
)}>{review.status}</Badge>
...

// Method handleStatusChange to accept any string, filter accordingly
const handleStatusChange = (value: string) => {
  if (value === "all") setStatusFilter("all");
  else setStatusFilter(value as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "approved" | "rejected");
};