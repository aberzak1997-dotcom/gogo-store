"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

const AdminReviewsPage = () => {
  const { reviews } = useStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reviews</h1>
        <p className="text-slate-500 mt-2 font-medium">Monitor and respond to customer feedback on your products.</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Star size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No reviews yet</h3>
            <p className="text-slate-500 mt-2">Customer reviews will appear here once they start sharing feedback.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Review list would go here */}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;