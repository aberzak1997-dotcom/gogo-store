import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isCustomerLoading: boolean;
  customerLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  customerRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  customerLogout: () => Promise<void>;
  updateCustomerName: (name: string) => void;
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// ── Helpers for localStorage fallback ──────────────────────────────────────────
const LS_CUSTOMER = "customer_session";
const LS_ACCOUNTS = "customer_accounts";

function getLocalSession(): CustomerUser | null {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOMER) || "null"); }
  catch { return null; }
}

function getLocalAccounts(): Record<string, { name: string; passwordHash: string }> {
  try { return JSON.parse(localStorage.getItem(LS_ACCOUNTS) || "{}"); }
  catch { return {}; }
}

// SHA-256 hash via Web Crypto API (no external deps, runs in all modern browsers)
async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function wishlistKey(id: string) { return `wishlist_${id}`; }

function getWishlist(customerId: string): string[] {
  try { return JSON.parse(localStorage.getItem(wishlistKey(customerId)) || "[]"); }
  catch { return []; }
}

// ── Provider ───────────────────────────────────────────────────────────────────
export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist whenever customer changes
  const loadWishlist = useCallback((cust: CustomerUser | null) => {
    if (cust) setWishlist(getWishlist(cust.id));
    else setWishlist([]);
  }, []);

  // ── Init session ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const cust: CustomerUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split("@")[0],
          };
          setCustomer(cust);
          loadWishlist(cust);
        }
        setIsCustomerLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const cust: CustomerUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split("@")[0],
          };
          setCustomer(cust);
          loadWishlist(cust);
        } else {
          setCustomer(null);
          setWishlist([]);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // localStorage fallback
      const saved = getLocalSession();
      setCustomer(saved);
      loadWishlist(saved);
      setIsCustomerLoading(false);
    }
  }, [loadWishlist]);

  // ── Login ─────────────────────────────────────────────────────────────────────
  const customerLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        const cust: CustomerUser = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || email.split("@")[0],
        };
        setCustomer(cust);
        loadWishlist(cust);
      }
      return { success: true };
    }

    // localStorage fallback — compare against stored SHA-256 hash
    const accounts = getLocalAccounts();
    const found = accounts[email.toLowerCase()];
    const inputHash = await hashPassword(password);
    if (!found || found.passwordHash !== inputHash) {
      return { success: false, error: "Invalid email or password." };
    }
    const cust: CustomerUser = { id: email.toLowerCase(), email, name: found.name };
    setCustomer(cust);
    localStorage.setItem(LS_CUSTOMER, JSON.stringify(cust));
    loadWishlist(cust);
    return { success: true };
  };

  // ── Register ──────────────────────────────────────────────────────────────────
  const customerRegister = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { success: false, error: error.message };

      // data.session is null when Supabase requires email confirmation.
      // Don't fake-login the user — they need to verify first.
      if (data.user && !data.session) {
        return { success: true, needsEmailConfirmation: true };
      }

      if (data.user && data.session) {
        const cust: CustomerUser = { id: data.user.id, email: data.user.email!, name };
        setCustomer(cust);
        loadWishlist(cust);
      }
      return { success: true };
    }

    // localStorage fallback — store SHA-256 hash, never plaintext
    const accounts = getLocalAccounts();
    if (accounts[email.toLowerCase()]) {
      return { success: false, error: "An account with this email already exists." };
    }
    const passwordHash = await hashPassword(password);
    accounts[email.toLowerCase()] = { name, passwordHash };
    localStorage.setItem(LS_ACCOUNTS, JSON.stringify(accounts));
    const cust: CustomerUser = { id: email.toLowerCase(), email, name };
    setCustomer(cust);
    localStorage.setItem(LS_CUSTOMER, JSON.stringify(cust));
    loadWishlist(cust);
    return { success: true };
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const customerLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCustomer(null);
    setWishlist([]);
    localStorage.removeItem(LS_CUSTOMER);
  };

  // ── Update name ───────────────────────────────────────────────────────────────
  const updateCustomerName = (name: string) => {
    if (!customer) return;
    const updated = { ...customer, name };
    setCustomer(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem(LS_CUSTOMER, JSON.stringify(updated));
      const accounts = getLocalAccounts();
      if (accounts[customer.email.toLowerCase()]) {
        accounts[customer.email.toLowerCase()].name = name;
        localStorage.setItem(LS_ACCOUNTS, JSON.stringify(accounts));
      }
    } else if (supabase) {
      supabase.auth.updateUser({ data: { full_name: name } });
    }
  };

  // ── Wishlist ──────────────────────────────────────────────────────────────────
  const addToWishlist = useCallback((productId: string) => {
    if (!customer) return;
    const updated = [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem(wishlistKey(customer.id), JSON.stringify(updated));
  }, [customer, wishlist]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (!customer) return;
    const updated = wishlist.filter(id => id !== productId);
    setWishlist(updated);
    localStorage.setItem(wishlistKey(customer.id), JSON.stringify(updated));
  }, [customer, wishlist]);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  return (
    <CustomerAuthContext.Provider value={{
      customer, isCustomerLoading,
      customerLogin, customerRegister, customerLogout, updateCustomerName,
      wishlist, addToWishlist, removeFromWishlist, isWishlisted,
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
};
