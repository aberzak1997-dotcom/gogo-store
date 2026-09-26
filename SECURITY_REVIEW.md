# Security Review Report

## Executive Summary

This security review identified **4 Critical**, **3 High**, **4 Medium**, and **2 Low** severity vulnerabilities in the WIVITEC e-commerce application. The most severe issues involve hardcoded admin credentials, overly permissive database RLS policies, and client-side storage of sensitive tokens.

---

## Critical Findings

### 1. Hardcoded Admin Credentials in Source Code
**File:** `src/context/AuthContext.tsx` (lines 33-37)

```typescript
const builtInAdmins = [
  { email: "admin@wivitec.com",    password: "Wivitec@2026" },
  { email: "artswfx120@gmail.com", password: "ADMIN1997"    },
];
```

**Risk:** These credentials are committed to source control and visible to anyone with repository access. They provide full admin access to the application including product management, order fulfillment, customer data, and CJ Dropshipping integration.

**Potential Solutions:**
1. **Immediate:** Remove hardcoded credentials and require all admin accounts to be created via Supabase Auth with proper role assignment
2. **Short-term:** Implement a secure admin provisioning flow (invite-only, email verification)
3. **Long-term:** Add MFA for admin accounts and audit logging for all admin actions

---

### 2. Overly Permissive RLS Policies - Full Database Access for Any Authenticated User
**File:** `supabase/schema.sql` (lines 180-193)

```sql
create policy "admin_all_products"            on products            for all to authenticated using (true) with check (true);
create policy "admin_all_customers"           on customers           for all to authenticated using (true) with check (true);
create policy "admin_all_orders"              on orders              for all to authenticated using (true) with check (true);
-- ... 10 more tables with identical policies
```

**Risk:** Any user who authenticates with Supabase (including regular customers) gets **full read/write access to ALL tables** - products, orders, customers, discounts, reviews, returns, campaigns, collections, and settings. This means a customer could:
- Read all other customers' PII (names, emails, addresses, phone numbers)
- Modify or delete any order
- Change product prices
- Access discount codes and marketing campaigns
- View internal notes on orders

**Potential Solutions:**
1. **Immediate:** Restrict policies to only allow access based on user ownership (e.g., `auth.uid() = user_id`)
2. **Create separate admin role:** Use a custom claim or role check in policies instead of blanket `authenticated` access
3. **Implement proper RLS:** Each table should have policies that restrict access to the user's own data

---

### 3. CJ Dropshipping Access Token Stored in localStorage (Client-Side)
**File:** `src/lib/cj-api.ts` (lines 45-55, 60-65)

```typescript
export function saveCJConnection(conn: CJConnection) {
  localStorage.setItem(LS_KEY, JSON.stringify(conn));
}
```

The `CJConnection` interface includes:
```typescript
export interface CJConnection {
  email: string;
  accessToken: string;        // <-- Sensitive!
  accessTokenExpiryDate: string;
  refreshToken: string;       // <-- Sensitive!
}
```

**Risk:** The CJ access token and refresh token are stored in localStorage, making them vulnerable to:
- XSS attacks (any script injection can steal tokens)
- Physical access to the browser
- Malicious browser extensions
- These tokens provide full access to the CJ Dropshipping account including order fulfillment, product catalog, and wallet balance

**Potential Solutions:**
1. **Immediate:** Move CJ token storage to a secure HTTP-only cookie or server-side session
2. **Short-term:** Implement token encryption before localStorage storage
3. **Long-term:** Use Supabase Edge Functions as a proxy for all CJ API calls, keeping tokens server-side only

---

### 4. CJ Proxy Endpoint Allows Unrestricted CORS (Any Origin Can Proxy Requests)
**File:** `api/cj-proxy.ts` (lines 5-7)

```typescript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-cj-token");
```

**Risk:** The proxy endpoint accepts requests from **any origin** and forwards them to CJ's API with the `x-cj-token` header. An attacker could:
1. Create a malicious website
2. Trick an admin into visiting it while logged into CJ
3. The malicious site calls the proxy with the admin's CJ token (from localStorage via XSS or social engineering)
4. The proxy forwards the request to CJ API with the stolen token

**Potential Solutions:**
1. **Immediate:** Restrict CORS to only the application's domain
2. **Short-term:** Add origin validation and rate limiting
3. **Long-term:** Move CJ API calls to Supabase Edge Functions (server-side only)

---

## High Findings

### 5. Public Anon Can Insert Orders, Customers, Returns Without Validation
**File:** `supabase/schema.sql` (lines 195-201)

```sql
create policy "public_insert_orders"    on orders    for insert to anon with check (true);
create policy "public_insert_items"     on order_items for insert to anon with check (true);
create policy "public_insert_timeline"  on order_timeline for insert to anon with check (true);
create policy "public_insert_customers" on customers for insert to anon with check (true);
create policy "public_insert_returns"   on return_requests for insert to anon with check (true);
create policy "public_insert_ret_items" on return_items for insert to anon with check (true);
```

**Risk:** Unauthenticated users can:
- Create unlimited fake orders (inventory manipulation, analytics pollution)
- Create fake customer records (PII pollution)
- Submit fraudulent return requests
- No rate limiting or CAPTCHA protection on these endpoints

**Potential Solutions:**
1. **Immediate:** Add rate limiting at the edge (Cloudflare/Vercel) or via Supabase
2. **Short-term:** Require reCAPTCHA/hCaptcha for public order creation
3. **Long-term:** Implement order validation (stock checks, price verification) in Edge Functions

---

### 6. Admin Session Stored in localStorage Without Expiry Enforcement
**File:** `src/context/AuthContext.tsx` (lines 22-30, 55-60)

```typescript
// Session stored in localStorage with 24-hour expiry
localStorage.setItem("admin_auth", "true");
localStorage.setItem("admin_auth_expiry", String(Date.now() + 24 * 60 * 60 * 1000));
```

**Risk:**
- No HTTP-only or Secure flags (accessible to JavaScript)
- 24-hour session is excessive for admin access
- No automatic revocation on password change or security events
- Vulnerable to XSS token theft

**Potential Solutions:**
1. Use Supabase Auth session cookies (HTTP-only, Secure, SameSite)
2. Implement short-lived access tokens with refresh token rotation
3. Add session invalidation on security events

---

### 7. Customer Password Hashes Stored in localStorage
**File:** `src/context/CustomerAuthContext.tsx` (lines 25-35, 85-95)

```typescript
// localStorage fallback stores SHA-256 hashes
const accounts = getLocalAccounts();
accounts[email.toLowerCase()] = { name, passwordHash };
localStorage.setItem(LS_ACCOUNTS, JSON.stringify(accounts));
```

**Risk:** While SHA-256 is better than plaintext:
- Client-side hashing means the hash IS the password equivalent
- If localStorage is compromised, attacker can use hash for offline cracking
- No salt used (same password = same hash across users)
- No key stretching (SHA-256 is fast, vulnerable to GPU cracking)

**Potential Solutions:**
1. Remove localStorage fallback entirely - require Supabase Auth
2. If fallback needed, use PBKDF2/Argon2 with per-user salt
3. Never store password-equivalent material client-side

---

## Medium Findings

### 8. No Input Validation on Order Creation (Client-Side Only)
**File:** `src/pages/storefront/CheckoutPage.tsx` (lines 380-410)

```typescript
const placeOrder = (): string | null =>
    createOrder({ customerName: fullName, email, phone, address, city, country });
```

**Risk:** Order creation relies entirely on client-side validation. An attacker can:
- Bypass quantity limits (order 1000+ items)
- Submit negative prices
- Inject malicious data in order fields
- The server-side `insertOrder` in `src/lib/db.ts` does no validation

**Potential Solutions:**
1. Add server-side validation in Supabase Edge Function or database triggers
2. Implement stock reservation with atomic transactions
3. Validate all inputs server-side before database insertion

---

### 9. Stripe Session Creation Lacks Authentication Verification
**File:** `supabase/functions/create-stripe-session/index.ts` (lines 1-50)

```typescript
// No authentication check - anyone can call this endpoint
const body = await req.json();
const { lineItems, orderId, customerEmail, successUrl, cancelUrl } = body;
```

**Risk:** The edge function creates Stripe checkout sessions without verifying:
- The caller is authenticated
- The orderId belongs to the caller
- The lineItems match actual cart contents
- The prices haven't been tampered with

An attacker could create checkout sessions for arbitrary amounts or hijack other users' orders.

**Potential Solutions:**
1. Verify JWT token in the edge function using `supabase.auth.getClaims()`
2. Validate order ownership before creating Stripe session
3. Recalculate prices server-side from database, not client-provided lineItems

---

### 10. Order Tracking Page Exposes All Orders by Email Enumeration
**File:** `src/pages/storefront/OrderTrackingPage.tsx` (lines 140-155)

```typescript
const found = orders.filter(
  o => o.email?.toLowerCase() === term || o.id.toLowerCase().includes(term)
);
```

**Risk:** The tracking page allows searching by email address. An attacker can:
- Enumerate valid customer emails by trying common addresses
- Access order details (items, addresses, payment method) for any email
- No rate limiting on search attempts

**Potential Solutions:**
1. Require order ID + email combination (not just email)
2. Add rate limiting on tracking searches
3. Implement CAPTCHA after failed attempts

---

### 11. No CSRF Protection on State-Changing Operations
**Files:** Multiple - `src/lib/db.ts`, `src/context/StoreContext.tsx`

**Risk:** All mutating operations (create order, update product, delete customer, etc.) lack CSRF tokens. Since the app uses Supabase's cookie-based auth, a malicious site could trick an authenticated admin into making unwanted changes.

**Potential Solutions:**
1. Implement CSRF tokens for all state-changing operations
2. Use SameSite=Strict cookies for Supabase auth
3. Require re-authentication for sensitive actions (delete, bulk operations)

---

## Low Findings

### 12. Error Messages Leak Internal Information
**File:** `supabase/functions/create-stripe-session/index.ts` (line 45)

```typescript
return new Response(
  JSON.stringify({ error: message }),
  { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
);
```

**Risk:** Stripe error messages (which may contain internal details) are returned directly to the client. While not directly exploitable, this aids reconnaissance.

**Potential Solutions:**
1. Sanitize error messages in production
2. Log detailed errors server-side, return generic messages to client

---

### 13. Missing Security Headers
**Files:** `vercel.json`, `vite.config.ts`

**Risk:** No CSP, HSTS, X-Frame-Options, or other security headers configured. This increases XSS and clickjacking risk.

**Potential Solutions:**
1. Add security headers via Vercel configuration or middleware
2. Implement Content Security Policy
3. Set X-Frame-Options: DENY

---

## Summary Table

| Severity | Count | Issues |
|----------|-------|--------|
| Critical | 4 | Hardcoded credentials, permissive RLS, CJ tokens in localStorage, open CORS proxy |
| High     | 3 | Public anon inserts, weak admin session, client-side password hashes |
| Medium   | 4 | No server-side validation, unauthenticated Stripe sessions, order enumeration, no CSRF |
| Low      | 2 | Error info leakage, missing security headers |

---

## Recommended Remediation Priority

1. **Week 1 (Critical):**
   - Remove hardcoded admin credentials
   - Rewrite all RLS policies with proper ownership checks
   - Move CJ tokens to server-side (Edge Functions)
   - Restrict CJ proxy CORS to application domain only

2. **Week 2 (High):**
   - Add rate limiting and CAPTCHA to public order/return endpoints
   - Migrate admin auth to Supabase session cookies
   - Remove localStorage password hash storage

3. **Week 3 (Medium):**
   - Add server-side validation for orders
   - Implement authentication in Stripe edge function
   - Add order ID + email requirement for tracking
   - Implement CSRF protection

4. **Week 4 (Low + Hardening):**
   - Sanitize error messages
   - Add security headers
   - Conduct penetration testing
   - Document security procedures