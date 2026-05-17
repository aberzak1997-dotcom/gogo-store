import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
  const { cart, products, updateCartQuantity, removeFromCart, createOrder } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return { ...item, product };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    createOrder(name, email);
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <main className="flex-grow container py-12 px-4 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border max-w-md w-full">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/">
              <Button size="lg" className="w-full">Start Shopping</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-6">Your Items</h2>
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex gap-4 py-4 border-b last:border-0">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="p-1 hover:bg-slate-100"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-slate-100"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                          <button 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              <form id="checkout-form" onSubmit={handleCheckout} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full h-12 text-lg"
              >
                Place Order
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;