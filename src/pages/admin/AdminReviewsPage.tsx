"use client";

import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Review } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<Review["status"], string> = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-500",
};

const AdminReviewsPage = () => {
  const { reviews, updateReview } = useStore();
  const [filter, setFilter] = useState<Review["status"] | "all">("all");

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.status === filter);

  const approve = (r: Review) => updateReview({ ...r, status: "approved" });
  const reject = (r: Review) => updateReview({ ...r, status: "rejected" });

  const counts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reviews</h1>
        <p className="text-slate-500 mt-2 font-medium">Monitor and moderate customer feedback on your products.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-slate-100 shadow-sm w-fit">
        {(["all", "pending", "approved", "rejected"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors",
              filter === tab ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Star size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No reviews</h3>
            <p className="text-slate-500 mt-2">
              {filter === "all" ? "Customer reviews will appear here once they share feedback." : `No ${filter} reviews.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(review => (
            <Card key={review.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                      {review.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-black text-slate-900">{review.customerName}</p>
                        <Badge className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border-transparent shadow-none", STATUS_STYLES[review.status])}>
                          {review.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                        {review.productTitle} · {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-0.5 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                        <span className="text-[10px] text-slate-400 font-bold ml-1">{review.rating}/5</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">{review.comment}</p>
                    </div>
                  </div>

                  {review.status === "pending" && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => approve(review)}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] h-9 px-4 gap-1.5"
                      >
                        <Check size={13} /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reject(review)}
                        className="rounded-xl text-rose-500 border-rose-200 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] h-9 px-4 gap-1.5"
                      >
                        <X size={13} /> Reject
                      </Button>
                    </div>
                  )}

                  {review.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateReview({ ...review, status: "pending" })}
                      className="rounded-xl text-slate-400 font-black uppercase tracking-widest text-[9px] h-9 px-3 flex-shrink-0"
                    >
                      Undo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
