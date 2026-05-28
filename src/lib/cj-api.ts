// CJ Dropshipping API client — all calls go through /api/cj-proxy to avoid CORS

export interface CJProduct {
  pid: string;
  productNameEn: string;
  productImage: string;
  productImageSet?: { imageUrl: string }[];
  sellPrice: string;
  remark?: string;
  categoryId?: string;
  categoryName?: string;
  productWeight?: string;
  productType?: string;
  variants?: CJVariant[];
}

export interface CJVariant {
  vid: string;
  variantNameEn?: string;
  variantImage?: string;
  variantSellPrice?: string;
  variantKey?: string;
}

export interface CJTrackingEvent {
  context: string;
  time: string;
  country?: string;
}

export interface CJConnection {
  email: string;
  accessToken: string;
  accessTokenExpiryDate: string;
  refreshToken: string;
}

const LS_KEY = "cj_connection";

// ── Stored connection ──────────────────────────────────────────────────────────
export function getCJConnection(): CJConnection | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const conn: CJConnection = JSON.parse(raw);
    if (new Date(conn.accessTokenExpiryDate) <= new Date()) return null; // expired
    return conn;
  } catch {
    return null;
  }
}

export function saveCJConnection(conn: CJConnection) {
  localStorage.setItem(LS_KEY, JSON.stringify(conn));
}

export function clearCJConnection() {
  localStorage.removeItem(LS_KEY);
}

// ── Proxy helper ───────────────────────────────────────────────────────────────
async function cjFetch(
  path: string,
  opts: { method?: string; token?: string; body?: unknown; params?: Record<string, string> }
) {
  const url = new URL("/api/cj-proxy", window.location.origin);
  url.searchParams.set("path", path);
  if (opts.params) {
    Object.entries(opts.params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers["x-cj-token"] = opts.token;

  const res = await fetch(url.toString(), {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const json = await res.json();
  return json;
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export async function cjAuthenticate(email: string, password: string): Promise<CJConnection> {
  const json = await cjFetch("authentication/getAccessToken", {
    method: "POST",
    body: { email, password },
  });
  if (!json.result) throw new Error(json.message || "CJ authentication failed. Check your credentials.");
  return { email, ...json.data } as CJConnection;
}

// ── Products ───────────────────────────────────────────────────────────────────
export async function cjSearchProducts(
  token: string,
  keyword: string,
  page = 1,
  pageSize = 20
): Promise<{ list: CJProduct[]; total: number }> {
  const json = await cjFetch("product/list", {
    token,
    params: {
      pageNum: String(page),
      pageSize: String(pageSize),
      ...(keyword ? { productNameEn: keyword } : {}),
    },
  });
  if (!json.result) throw new Error(json.message || "Failed to fetch products");
  return json.data || { list: [], total: 0 };
}

export async function cjGetProduct(token: string, pid: string): Promise<CJProduct> {
  const json = await cjFetch("product/query", { token, params: { pid } });
  if (!json.result) throw new Error(json.message || "Failed to fetch product");
  return json.data;
}

// ── Orders ─────────────────────────────────────────────────────────────────────
export interface CJOrderPayload {
  orderNumber: string;
  shippingCustomerName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountryCode: string;
  email: string;
  fromCountryCode: string;
  logisticName: string;
  products: { vid: string; quantity: number }[];
}

export async function cjCreateOrder(token: string, payload: CJOrderPayload) {
  const json = await cjFetch("shopping/order/createOrderV2", {
    method: "POST",
    token,
    body: payload,
  });
  if (!json.result) throw new Error(json.message || "Failed to create CJ order");
  return json.data;
}

// ── Tracking ───────────────────────────────────────────────────────────────────
export async function cjGetTracking(token: string, orderId: string): Promise<CJTrackingEvent[]> {
  const json = await cjFetch("logistic/track/list", { token, params: { orderId } });
  if (!json.result) throw new Error(json.message || "Failed to get tracking");
  return json.data || [];
}
