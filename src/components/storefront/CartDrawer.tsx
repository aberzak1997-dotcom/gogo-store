import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Badge } from "@/components/ui/badge";

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
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-slate-500 mb-6">Looks like you haven't added any tech gear yet.</p>
              <SheetClose asChild>
                <Button variant="outline">Continue Shopping</Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden border flex-shrink-0">
                      <img
                        src={item.product!.imageUrl}
                        alt={item.product!.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.product!.title}</h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{item.product!.brand}</p>

                      {item.product!.status !== "active" ? (
                        <Badge variant="destructive" className="text-[10px] mb-2">Unavailable</Badge>
                      ) : item.product!.stockQuantity < item.quantity ? (
                        <div className="flex items-center gap-1 text-amber-600 text-[10px] font-medium mb-2">
                          <AlertCircle size={12} />
                          Only {item.product!.stockQuantity} in stock
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md bg-white">
                          <button
                            className="p-1 hover:bg-slate-50 disabled:opacity-30"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            className="p-1 hover:bg-slate-50 disabled:opacity-30"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product!.stockQuantity}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-sm">
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
          <SheetFooter className="p-6 border-t bg-slate-50/50 flex-col sm:flex-col gap-4">
            <div className="space-y-2 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="text-green-600 font-medium">Calculated at checkout</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg gap-2"
              disabled={hasStockIssues}
              onClick={handleCheckout}
            >
              Checkout <ArrowRight size={20} />
            </Button>

            {hasStockIssues && (
              <p className="text-xs text-center text-red-500 font-medium">
                Please resolve stock issues before checking out.
              </p>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;