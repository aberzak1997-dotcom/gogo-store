import React from "react";
import { returnRequest as ReturnRequest } from "../../types";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminReturnsPage = () => {
  const { returns, updateReturnStatus } = useStore();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Returns Management</h1>

      {returns.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">No return requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((detailReturn) => (
            <div
              key={detailReturn.id}
              className="p-4 border rounded-md bg-white shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-bold">Order #{detailReturn.orderId}</p>
                <p>
                  Status: <span className={cn("font-medium", detailReturn.status === "received" && "text-emerald-600")}>{detailReturn.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={detailReturn.status === "received" ? "secondary" : "primary"}
                  onClick={() => updateReturnStatus(detailReturn.id, "received")}
                >
                  Mark as Received
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReturnsPage;