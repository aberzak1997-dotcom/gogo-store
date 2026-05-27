"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, products, updateCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const cartItems = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((item) => item.product !== undefined);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);
  const hasStockIssues = cartItems.some(
    (item) => item.product!.stockQuantity < item.quantity || item.product!.status !== "active"
  );

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-white/[0.06] rounded-none bg-white">
        {/* Header — dark */}
        <SheetHeader className="px-6 py-5 bg-[#0E121A] sticky top-0 z-10 border-b border-white/[0.06]">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-[#1528A1] rounded-[8px]">
              <ShoppingBag size={18} />
            </div>
            <span className="font-semibold text-[17px]">Your Cart</span>
            <span className="ml-auto text-caption text-[#479BF7]">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-grow overflow-hidden bg-[#F0F2F8]">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-white rounded-[12px] flex items-center justify-center mb-6 shadow-sm">
                <ShoppingBag className="h-10 w-10 text-[#0C0D10]/20" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0C0D10] mb-2">Your cart is empty</h3>
              <p className="text-[14px] text-[#0C0D10]/50 mb-8 max-w-[220px]">
                Haven't added any tech gear yet.
              </p>
              <SheetClose asChild>
                <Button className="bg-[#1160CB] hover:bg-[#479BF7] text-white rounded-[8px] px-8 h-11 text-[14px] font-semibold transition-all">
                  Start Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 bg-white p-4 rounded-[12px] border border-[#F0F2F8] transition-all"
                    style={{ boxShadow: "0 2px 8px rgba(21,40,161,0.04)" }}
                  >
                    <div className="w-20 h-20 rounded-[8px] bg-[#F0F2F8] overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.product!.imageUrl}
                        alt={item.product!.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-[#0C0D10] line-clamp-1 text-[14px] pr-2">
                          {item.product!.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#0C0D10]/20 hover:text-rose-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p
                        className="text-[#1160CB] mb-3"
                        style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 500 }}
                      >
                        {item.product!.brand}
                      </p>

                      {item.product!.status !== "active" ? (
                        <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full w-fit mb-2">
                          Unavailable
                        </span>
                      ) : item.product!.stockQuantity < item.quantity ? (
                        <div className="flex items-center gap-1 text-amber-600 text-[11px] mb-2">
                          <AlertCircle size={11} />
                          Only {item.product!.stockQuantity} left
                        </div>
                      ) : null}

                      <div className="mt-auto flex items-center justify-between">
                        {/* Qty controls */}
                        <div
                          className="flex items-center gap-1 bg-[#F0F2F8] rounded-full p-0.5"
                        >
                          <button
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-all disabled:opacity-30"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-[13px] font-semibold text-[#0C0D10]">
                            {item.quantity}
                          </span>
                          <button
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-all disabled:opacity-30"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product!.stockQuantity}
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="font-bold text-[#1528A1] text-[15px]">
                          ${(item.product!.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <SheetFooter className="px-6 py-6 border-t border-[#F0F2F8] bg-white flex-col sm:flex-col gap-5">
            <div className="space-y-3 w-full">
              <div className="flex justify-between text-[13px] text-[#0C0D10]/50">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0C0D10]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#0C0D10]/50">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="h-px bg-[#F0F2F8]" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#0C0D10] text-[15px]">Total</span>
                <span className="font-bold text-[#1528A1] text-[22px]">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full h-12 text-[15px] font-semibold rounded-[8px] bg-[#1160CB] hover:bg-[#479BF7] text-white gap-2 transition-all"
              disabled={hasStockIssues}
              onClick={handleCheckout}
            >
              Checkout Now <ArrowRight size={17} />
            </Button>

            {hasStockIssues && (
              <div className="flex items-center justify-center gap-2 text-rose-600 text-[12px] bg-rose-50 p-3 rounded-[8px]">
                <AlertCircle size={14} />
                Please resolve stock issues before checkout
              </div>
            )}

            <p className="text-center text-[11px] text-[#0C0D10]/30 uppercase tracking-[2px]">
              Secure · Fast · Trusted
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
