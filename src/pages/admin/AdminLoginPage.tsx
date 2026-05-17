"use client";

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Lock, Smartphone, ArrowLeft, ShieldCheck } from "lucide-react";
import { showError, showSuccess } from "../../utils/toast";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1000));
    
    if (login(email, password)) {
      showSuccess("Welcome back, Admin!");
      navigate(from, { replace: true });
    } else {
      showError("Invalid credentials. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070')] bg-cover bg-center opacity-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Store
        </Link>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/95 backdrop-blur-xl">
          <CardHeader className="space-y-4 text-center p-10 pb-6">
            <div className="flex justify-center">
              <div className="p-4 bg-primary rounded-[1.5rem] shadow-lg shadow-primary/20 rotate-3">
                <LayoutDashboard className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Admin Access</CardTitle>
              <CardDescription className="text-slate-500 font-medium">
                Secure portal for store management
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                  placeholder="admin@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                  <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black gap-3 shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Authenticating..." : (
                  <>
                    Sign In <Lock size={20} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                <ShieldCheck size={14} className="text-emerald-500" /> Demo Credentials
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-slate-600 flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="font-bold text-slate-900">admin@demo.com</span>
                </p>
                <p className="text-slate-600 flex justify-between">
                  <span className="font-medium">Password:</span>
                  <span className="font-bold text-slate-900">admin123</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          Authorized Personnel Only • © 2024 ElectroStore
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;