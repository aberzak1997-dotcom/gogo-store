"use client";

import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft, ShieldCheck, Truck, CreditCard, Lock, Zap, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { showError } from "../../utils/toast";
import { Product, CartItem } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CheckoutPage = () => {
  const {
    cart,
    products,
    createOrder,
  } = useStore();

  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'cod'
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const enrichedCart = useMemo(() => {
    return cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...item, product } : null;
    }).filter(Boolean) as (CartItem & { product: Product })[];
  }, [cart, products]);

  if (enrichedCart.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow section-container py-24">
          <div className="max-w-xl mx-auto text-center p-16 rounded-none bg-slate-50 border border-slate-100">
            <div className="w-24 h-24 bg-white rounded-none flex items-center justify-center mx-auto mb-10 shadow-sm">
              <AlertTriangle className="h-12 w-12 text-slate-200" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight">Your Cart is Empty</h2>
            <p className="text-slate-500 mb-12 text-lg font-medium">
              You need to add some tech gear to your cart before you can checkout.
            </p>
            <Button size="lg" className="rounded-full h-16 px-12 text-sm font-black uppercase tracking-widest" onClick={() => navigate("/")}>Return to Store</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = enrichedCart.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !address || !city || !country) {
      showError("Please fill in all required fields");
      return;
    }

    setIsPlacing(true);
    await new Promise(res => setTimeout(res, 2000));

    const newOrderId = createOrder({
      customerName: fullName,
      email,
      phone,
      address,
      city,
      country,
    });

    if (newOrderId) {
      setOrderId(newOrderId);
    }
    setIsPlacing(false);
  };

  if (orderId) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow section-container py-24">
          <div className="max-w-2xl mx-auto rounded-none shadow-2xl border border-slate-100 overflow-hidden bg-white">
            <div className="bg-slate-900 p-16 text-center text-white">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Order Confirmed!</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Thank you for shopping with ElectroStore</p>
            </div>
            <div className="p-16 space-y-10">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Number</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{orderId}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                  <p className="text-xl font-black text-slate-900">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <Separator className="bg-slate-100" />
              
              <div className="space-y-6">
                <p className="text-slate-500 leading-relaxed text-center font-medium">
                  We've sent a confirmation email to <span className="font-black text-slate-900">{email}</span> with your order details.
                </p>
                <div className="bg-slate-50 p-8 rounded-none border border-slate-100 flex items-center gap-6">
                  <div className="p-4 bg-white rounded-none shadow-sm text-primary">
                    <Truck size={28} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Estimated Delivery</p>
                    <p className="text-sm text-slate-500 font-bold">3-5 Business Days</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-none border border-slate-100 flex items-center gap-6">
                  <div className="p-4 bg-white rounded-none shadow-sm text-primary">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Payment Method</p>
                    <p className="text-sm text-slate-500 font-bold">
                      {paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Credit Card"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  size="lg" 
                  className="flex-1 rounded-full h-16 text-sm font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/20" 
                  onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow section-container py-16">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            <div className="rounded-none border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 p-10">
                <h3 className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-900">
                  <div className="p-2 bg-white rounded-none text-primary shadow-sm">
                    <Truck size={20} />
                  </div>
                  Shipping Information
                </h3>
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                    <Input
                      id="fullName"
                      className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                    <Input
                      id="phone"
                      className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address</Label>
                    <Input
                      id="address"
                      className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="123 Tech Lane"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</Label>
                    <Input
                      id="city"
                      className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="San Francisco"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="country" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</Label>
                    <Input
                      id="country"
                      className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="United States"
                      required
                    />
                  </div>
                </form>
              </div>

              <div className="rounded-none border border-slate-100 bg-white shadow-sm overflow-hidden mt-6">
                <div className="bg-slate-50/50 border-b border-slate-100 p-10">
                  <h3 className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-900">
                    <div className="p-2 bg-white rounded-none text-primary shadow-sm">
                      <CreditCard size={20} />
                    </div>
                    Payment Method
                  </h3>
                  <div className="p-10 space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="paymentMethod" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="w-full p-2 border border-slate-200 bg-slate-50/50 text-sm font-black rounded-xl h-12">
                          <SelectValue placeholder="Select payment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentMethod === "cod" ? (
                      <div className="bg-slate-50 p-8 rounded-none border border-slate-100 flex items-center gap-6">
                        <div className="p-4 bg-white rounded-none shadow-sm text-primary">
                          <Truck size={28} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Cash on Delivery</p>
                          <p className="text-sm text-slate-500 font-bold">You will pay ${total.toFixed(2)} in cash upon delivery.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-8 rounded-none border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-white rounded-none shadow-sm text-primary">
                            <Lock size={28} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Secure Payment</p>
                            <p className="text-sm text-slate-500 font-bold">Payment will be processed securely</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-transparent font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-none">ENCRYPTED</Badge>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
                      By clicking "Place Order", you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                <div className="rounded-none border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                  <div className="p-10 border-b border-slate-50">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Order Summary</h3>
                    <div className="divide-y divide-slate-50">
                      {enrichedCart.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-none bg-slate-50 border border-slate-100 p-1.5 flex-shrink-0">
                              <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="font-bold text-slate-900 text-xs uppercase tracking-tight line-clamp-1">{item.product.title}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-black text-slate-900 text-sm tracking-tight">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-50" />

                  <div className="p-10 space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Shipping</span>
                      <span className={cn("font-black", shipping === 0 ? "text-emerald-600" : "text-slate-900")}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Estimated Tax (7%)</span>
                      <span className="text-slate-900">${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-6 bg-slate-50" />
                    <div className="flex justify-between items-end">
                      <span className="text-slate-900 font-black text-lg uppercase tracking-tighter">Total</span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span>
                    </div>

                    <Button
                      form="checkout-form"
                      type="submit"
                      className="w-full h-16 text-sm font-black uppercase tracking-widest gap-3 rounded-full shadow-2xl shadow-primary/20 mt-6"
                      disabled={isPlacing}
                    >
                      {isPlacing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order <Zap size={20} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-none border border-slate-100 flex flex-col items-center text-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={28} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Checkout</span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-none border border-slate-100 flex flex-col items-center text-center gap-3">
                    <RotateCcw className="text-blue-500" size={28} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;