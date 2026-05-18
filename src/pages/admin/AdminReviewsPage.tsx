"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, Option } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { chevronDown } from "lucide-react";

const AdminReviewsPage = () => {
  const { reviews, updateReviewStatus, deleteReview } = useStore();
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = reviews.filter(review => {
    if (searchTerm && !review.customerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (ratingFilter > 0 && review.rating !== ratingFilter) return false;
    if (statusFilter !== "all" && review.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (status: "pending" | "approved" | "rejected" | "all") => {
    setStatusFilter(status);
  };

  const handleRatingChange = (rating: number) => {
    setRatingFilter(rating);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApprove = (reviewId: string) => {
    updateReviewStatus(reviewId, "approved");
  };

  const handleReject = (reviewId: string) => {
    updateReviewStatus(reviewId, "rejected");
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reviews</h1>
        <p className="text-slate-500 mt-2 font-medium">Monitor and respond to customer feedback on your products.</p>
      </div>

      <div className="relative max-w-md">
        <Input 
          placeholder="Search reviews..." 
          value={searchTerm} 
          onChange={handleSearch} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" 
        />
        <Input 
          placeholder="Search reviews..." 
          className="pl-10 rounded-xl" 
        />
      </div>

      <div className="grid gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-900 mb-1">Rating</label>
            <Select onChange={e => handleRatingChange(Number(e.target.value))} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <Option value={0}>All Ratings</Option>
              <Option value={1}>1 Star</Option>
              <Option value={2}>2 Stars</Option>
              <Option value={2.5}>2.5 Stars</Option>
              <Option value={3}>3 Stars</Option>
              <Option value={4}>4 Stars</Option>
              <Option value={5}>5 Stars</Option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-900 mb-1">Status</label>
            <Select onChange={e => handleStatusChange(e.target.value as any)} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <Option value="all">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setRatingFilter(1)}>1★</Button>
          <Button variant="ghost" onClick={() => setRatingFilter(2)}>2★</Button>
          <Button variant="ghost" onClick={() => setRatingFilter(3)}>3★</Button>
          <Button variant="ghost" onClick={() => setRatingFilter(4)}>4★</Button>
          <Button variant="ghost" onClick={() => setRatingFilter(5)}>5★</Button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Badge className="bg-amber-50 text-amber-600 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">No reviews</Badge>
            </div>
            <h3 className="text-2xl font-black text-slate-900">No reviews yet</h3>
            <p className="text-slate-500 mt-2">Customer reviews will appear here once they start sharing feedback.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="divide-y divide-slate-50">
          {filteredReviews.map(review => (
            <div key={review.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">{review.customerName.charAt(0)}</div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{review.productTitle}</p>
                  <p className="text-xs text-slate-400 font-medium">{review.customerName}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-medium text-slate-900">{review.rating}</span>
                <Badge className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded", review.status === "approved" ? "bg-emerald-100 text-emerald-700" : review.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                  {review.status}
                </Badge>
                <div className="mt-1 flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleApprove(review.id)}>Approve</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleReject(review.id)}>Reject</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;