// Vercel Serverless Function — CJ Dropshipping API proxy
// Avoids CORS issues by forwarding requests server-side

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-cj-token");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { path, ...queryParams } = req.query as Record<string, string>;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const cjToken = req.headers["x-cj-token"] as string | undefined;

  const cjHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (cjToken) cjHeaders["CJ-Access-Token"] = cjToken;

  // Build CJ URL
  const url = new URL(`https://developers.cjdropshipping.com/api2.0/v1/${path}`);
  Object.entries(queryParams).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, v);
  });

  try {
    const cjRes = await fetch(url.toString(), {
      method: req.method === "GET" ? "GET" : req.method,
      headers: cjHeaders,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await cjRes.json();
    return res.status(cjRes.status).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: "CJ proxy error", details: err.message });
  }
}
