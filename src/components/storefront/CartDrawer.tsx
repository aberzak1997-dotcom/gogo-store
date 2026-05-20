"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertCircle, Zap } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, products, updateCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const hasStockIssues = cartItems.some(item =>
    item.product!.stockQuantity < item.quantity || item.product!.status !== "active"
  );

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-slate-100 rounded-none">
        <SheetHeader className="p-8 border-b border-slate-50 bg-white sticky top-0 z-10">
          <SheetTitle className="flex items-center gap-4 text-2xl font-black uppercase tracking-tighter">
            <div className="p-2 bg-slate-900 rounded-none text-white">
              <ShoppingBag size={24} />
            </div>
            Your Cart
            <Badge variant="secondary" className="ml-auto rounded-none px-3 py-1 font-black text-[10px] bg-slate-100 text-slate-900">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-hidden bg-slate-50/30">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-white rounded-none shadow-sm flex items-center justify-center mb-8 border border-slate-100">
                <ShoppingBag className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tight">Your cart is empty</h3>
              <p className="text-slate-500 mb-10 max-w-[240px] mx-auto font-medium">Looks like you haven't added any tech gear yet.</p>
              <SheetClose asChild>
                <Button size="lg" className="rounded-full px-10 font-black uppercase tracking-widest text-[10px] h-14">Start Shopping</Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full p-8">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="group flex gap-6 bg-white p-5 rounded-none border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="w-24 h-24 rounded-none bg-slate-50 overflow-hidden border border-slate-50 flex-shrink-0 p-3">
                      <img
                        src={item.product!.imageUrl}
                        alt={item.product!.title}
                        className="w-full h-full object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors text-sm uppercase tracking-tight">{item.product!.title}</h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{item.product!.brand}</p>

                      {item.product!.status !== "active" ? (
                        <Badge variant="destructive" className="text-[8px] font-black uppercase tracking-widest mb-4 w-fit rounded-none">Unavailable</Badge>
                      ) : item.product!.stockQuantity < item.quantity ? (
                        <div className="flex items-center gap-1.5 text-amber-600 text-[8px] font-black mb-4 bg-amber-50 px-2 py-1 rounded-none w-fit uppercase tracking-widest">
                          <AlertCircle size={12} />
                          ONLY {item.product!.stockQuantity} LEFT
                        </div>
                      ) : null}

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-slate-200 rounded-full bg-white p-0.5">
                          <button
                            className="p-1.5 hover:bg-slate-50 rounded-full transition-all disabled:opacity-30"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-black w-8 text-center">{item.quantity}</span>
                          <button
                            className="p-1.5 hover:bg-slate-50 rounded-full transition-all disabled:opacity-30"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product!.stockQuantity}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-black text-slate-900 text-sm">
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

        {cartItems.length > 0 && (
          <SheetFooter className="p-10 border-t border-slate-100 bg-white flex-col sm:flex-col gap-8">
            <div className="space-y-4 w-full">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400">Shipping</span>
                <span className="text-emerald-600">FREE</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-end">
                <span className="text-slate-900 font-black text-lg uppercase tracking-tighter">Total</span>
                <div className="text-right">
                  <span className="block text-3xl font-black text-slate-900 tracking-tighter">${subtotal.toFixed(2)}</span>
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Including VAT</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <Button
                className="w-full h-16 text-sm font-black uppercase tracking-widest gap-3 rounded-full shadow-2xl shadow-primary/20"
                disabled={hasStockIssues}
                onClick={handleCheckout}
              >
                Checkout Now <ArrowRight size={20} />
              </Button>
              
              {hasStockIssues && (
                <div className="flex items-center justify-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest bg-rose-50 p-4 rounded-none">
                  <AlertCircle size={16} />
                  Please resolve stock issues
                </div>
              )}
              
              <div className="flex items-center justify-center gap-6 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-500" /> Secure
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-500" /> Fast
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-500" /> Trusted
                </div>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;