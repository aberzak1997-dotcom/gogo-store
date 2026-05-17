"use client";

import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft, ShieldCheck, Truck, CreditCard, Lock } from "lucide-react";
import { showError } from "../../utils/toast";
import { Product, CartItem } from "../../types";
import { cn } from "@/lib/utils";

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

  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const enrichedCart = useMemo(() => {
    return cart
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean) as (CartItem & { product: Product })[];
  }, [cart, products]);

  if (enrichedCart.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow section-container py-20">
          <Card className="max-w-xl mx-auto text-center p-12 rounded-[2.5rem] shadow-xl border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-12 w-12 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900">Your Cart is Empty</h2>
            <p className="text-slate-500 mb-10 text-lg">
              You need to add some tech gear to your cart before you can checkout.
            </p>
            <Button size="lg" className="rounded-2xl h-14 px-10 text-lg font-bold" onClick={() => navigate("/")}>Return to Store</Button>
          </Card>
        </main>
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
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow section-container py-20">
          <Card className="max-w-2xl mx-auto rounded-[3rem] shadow-2xl border-none overflow-hidden">
            <div className="bg-emerald-500 p-12 text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl font-black mb-2">Order Confirmed!</h2>
              <p className="text-emerald-50/80 font-medium">Thank you for shopping with ElectroStore</p>
            </div>
            <CardContent className="p-12 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Number</p>
                  <p className="text-lg font-black text-slate-900">{orderId}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                  <p className="text-lg font-black text-slate-900">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed text-center">
                  We've sent a confirmation email to <span className="font-bold text-slate-900">{email}</span> with your order details and tracking information.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Estimated Delivery</p>
                    <p className="text-sm text-slate-500">3-5 Business Days</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="flex-1 rounded-2xl h-14 font-black" onClick={() => navigate("/")}>Continue Shopping</Button>
                <Button size="lg" variant="outline" className="flex-1 rounded-2xl h-14 font-black border-slate-200" onClick={() => navigate("/")}>View Order Status</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      <main className="flex-grow section-container py-12">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <CardTitle className="flex items-center gap-3 text-xl font-black">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Truck size={20} />
                  </div>
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName" className="font-bold text-slate-700">Full Name</Label>
                    <Input
                      id="fullName"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-slate-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold text-slate-700">Phone Number</Label>
                    <Input
                      id="phone"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="font-bold text-slate-700">Street Address</Label>
                    <Input
                      id="address"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="123 Tech Lane"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-bold text-slate-700">City</Label>
                    <Input
                      id="city"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="San Francisco"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="font-bold text-slate-700">Country</Label>
                    <Input
                      id="country"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="United States"
                      required
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <CardTitle className="flex items-center gap-3 text-xl font-black">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <CreditCard size={20} />
                  </div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400">
                      <Lock size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Secure Payment</p>
                      <p className="text-sm text-slate-500">Payment will be processed securely</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-transparent font-bold">ENCRYPTED</Badge>
                </div>
                <p className="mt-6 text-xs text-slate-400 text-center">
                  By clicking "Place Order", you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-[2rem] border-slate-100 shadow-lg overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100">
                  <CardTitle className="text-xl font-black">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {enrichedCart.map(item => (
                      <div key={item.productId} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-2 flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.product.title}</p>
                          <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-black text-slate-900 text-sm">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Subtotal</span>
                      <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Shipping</span>
                      <span className={cn("font-bold", shipping === 0 ? "text-emerald-600" : "text-slate-900")}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Estimated Tax (7%)</span>
                      <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-end">
                      <span className="text-slate-900 font-black text-xl">Total</span>
                      <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    form="checkout-form"
                    type="submit"
                    className="w-full h-16 text-lg font-black gap-3 rounded-2xl shadow-lg shadow-primary/20 mt-4"
                    disabled={isPlacing}
                  >
                    {isPlacing ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order <Zap size={20} />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Secure Checkout</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2">
                  <RotateCcw className="text-blue-500" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;