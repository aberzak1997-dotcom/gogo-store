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
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import { showError } from "../../utils/toast";

const CheckoutPage = () => {
  const {
    cart,
    products,
    createOrder,
    updateOrderStatus,
    updateProductStock,
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

  // Build enriched cart items
  const enrichedCart = useMemo(() => {
    return cart
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean) as (CartItem & { product: Product })[];
  }, [cart, products]);

  // Early empty‑cart state
  if (enrichedCart.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow container py-12 px-4 md:px-6">
          <Card className="max-w-xl mx-auto text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Your Cart Is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate("/")}>Return to Store</Button>
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
  const tax = Math.round(subtotal * 0.07 * 100) / 100; // 7% tax
  const total = subtotal + shipping + tax;

  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    if (!fullName.trim()) return "Full name is required";
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Email is invalid";
    if (!phone.trim()) return "Phone is required";
    if (!address.trim()) return "Address is required";
    if (!city.trim()) return "City is required";
    if (!country.trim()) return "Country is required";
    if (enrichedCart.length === 0) return "Your cart is empty";
    // Stock validation
    for (const item of enrichedCart) {
      if (item.product.stockQuantity < item.quantity) {
        return `Insufficient stock for "${item.product.title}"`;
      }
      if (item.product.status !== "active") {
        return `"${item.product.title}" is no longer available`;
      }
    }
    return null;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      showError(error);
      return;
    }

    setIsPlacing(true);
    // Simulate processing delay
    await new Promise(res => setTimeout(res, 1500));

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
    // Success confirmation view
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow container py-12 px-4 md:px-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle className="text-2xl font-bold">Order Placed Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-lg">
                Thank you, <strong>{fullName}</strong>! Your order has been received.
              </p>
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Total Amount:</strong> ${total.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                Your order is currently <span className="font-medium text-amber-600">Pending</span>. You will receive an email confirmation shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button onClick={() => navigate("/")}>Back to Home</Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border">
          {/* Customer Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
                {!fullName && <p className="text-sm text-red-600 mt-1">Full name is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
                {email && !emailRegex.test(email) && (
                  <p className="text-sm text-red-600 mt-1">Email is invalid</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 555 123 4567"
                  required
                />
                {!phone && <p className="text-sm text-red-600 mt-1">Phone is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  required
                />
                {!address && <p className="text-sm text-red-600 mt-1">Address is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="San Francisco"
                  required
                />
                {!city && <p className="text-sm text-red-600 mt-1">City is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="USA"
                  required
                />
                {!country && <p className="text-sm text-red-600 mt-1">Country is required</p>}
              </div>
            </div>

            {/* Trust badge */}
            <div className="bg-gray-50 p-6 rounded-xl border mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-green-600" size={20} />
                Secure Checkout
              </h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and never stored on our servers.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Secure Checkout • Warranty Included • Easy Returns</span>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isPlacing}
            >
              {isPlacing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedCart.map(item => (
                  <TableRow key={item.productId}>
                    <TableCell className="flex items-center gap-2">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell colSpan={2} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-right text-sm text-muted-foreground">
                    Shipping
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-right text-sm text-muted-foreground">
                    Tax (7%)
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    ${tax.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell colSpan={2} className="text-right text-lg font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold">
                    ${total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="text-center text-sm text-muted-foreground">
              <p>All orders are processed securely.</p>
              <p>Warranty and return policies apply.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;