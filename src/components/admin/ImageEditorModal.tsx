import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  X, RotateCcw, RotateCw, FlipHorizontal, FlipVertical,
  Crop, Sliders, Globe, Download, Check, RefreshCw, Image as ImageIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface CropBox { x: number; y: number; w: number; h: number }   // percentages 0-100
type AspectRatio = "free" | "1:1" | "4:3" | "3:4" | "16:9";
type OutputFormat = "image/webp" | "image/jpeg" | "image/png";
type Tab = "crop" | "optimize" | "seo";

interface Props {
  src: string;            // URL or base64
  productTitle?: string;
  onSave: (result: { url: string; altText: string; filename: string }) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const ASPECT_OPTIONS: { label: string; value: AspectRatio }[] = [
  { label: "Free", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "4:3", value: "4:3" },
  { label: "3:4", value: "3:4" },
  { label: "16:9", value: "16:9" },
];

const ASPECT_RATIOS: Record<AspectRatio, number | null> = {
  free: null, "1:1": 1, "4:3": 4 / 3, "3:4": 3 / 4, "16:9": 16 / 9,
};

const DIM_OPTIONS = [
  { label: "Original", value: 0 },
  { label: "1200px", value: 1200 },
  { label: "800px", value: 800 },
  { label: "600px", value: 600 },
  { label: "400px", value: 400 },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatBytes(b: number) {
  if (b > 1_000_000) return `${(b / 1_000_000).toFixed(1)} MB`;
  if (b > 1_000) return `${Math.round(b / 1_000)} KB`;
  return `${b} B`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas processor — pure function, no React
// ─────────────────────────────────────────────────────────────────────────────
async function processImage(
  src: string,
  cropBox: CropBox,
  rotation: number,           // degrees: 0/90/180/270
  flipH: boolean,
  flipV: boolean,
  brightness: number,         // 0-200 (100 = normal)
  contrast: number,
  saturation: number,
  maxDim: number,             // 0 = keep original
  format: OutputFormat,
  quality: number,            // 1-100
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // ── Crop region in natural pixels ────────────────────────────
      const cx = (cropBox.x / 100) * img.naturalWidth;
      const cy = (cropBox.y / 100) * img.naturalHeight;
      const cw = (cropBox.w / 100) * img.naturalWidth;
      const ch = (cropBox.h / 100) * img.naturalHeight;

      // ── Output dimensions after rotation ─────────────────────────
      const rot90 = rotation === 90 || rotation === 270;
      let outW = rot90 ? ch : cw;
      let outH = rot90 ? cw : ch;

      if (maxDim > 0 && (outW > maxDim || outH > maxDim)) {
        const scale = maxDim / Math.max(outW, outH);
        outW = Math.round(outW * scale);
        outH = Math.round(outH * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;

      // ── CSS filter for brightness / contrast / saturation ─────────
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      // ── Transform: move to centre, rotate, flip, draw ─────────────
      ctx.translate(outW / 2, outH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // When rotated 90/270 the crop dimensions swap in canvas space
      const drawW = rot90 ? ch : cw;
      const drawH = rot90 ? cw : ch;

      // We need scale so cropped portion fills output after rotation
      const scaleX = outW / (rot90 ? ch : cw);
      const scaleY = outH / (rot90 ? cw : ch);
      const s = Math.min(scaleX, scaleY);

      ctx.drawImage(
        img,
        cx, cy, cw, ch,
        (-drawW / 2) * s, (-drawH / 2) * s,
        drawW * s, drawH * s,
      );

      resolve(canvas.toDataURL(format, quality / 100));
    };
    img.onerror = reject;
    img.src = src;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const ImageEditorModal: React.FC<Props> = ({ src, productTitle = "", onSave, onClose }) => {
  const [tab, setTab] = useState<Tab>("crop");

  // ── Crop state ──────────────────────────────────────────────────
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, w: 100, h: 100 });
  const [aspect, setAspect] = useState<AspectRatio>("free");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // ── Optimize state ──────────────────────────────────────────────
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(82);
  const [maxDim, setMaxDim] = useState(800);

  // ── SEO state ───────────────────────────────────────────────────
  const [altText, setAltText] = useState("");
  const [filename, setFilename] = useState("");

  // ── Preview / processing ────────────────────────────────────────
  const [preview, setPreview] = useState<string>(src);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });

  // ── Drag state ──────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    type: "move" | "new" | string;  // string = handle id (tl, tr, …)
    startX: number; startY: number;
    origBox: CropBox;
  } | null>(null);

  // ── Load natural size on mount ──────────────────────────────────
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
    // Auto-fill SEO defaults
    if (productTitle) {
      setAltText(productTitle);
      setFilename(slugify(productTitle) + "-product-image");
    }
    setPreview(src);
  }, [src, productTitle]);

  // ── Regenerate preview whenever settings change (debounced) ─────
  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const result = await processImage(src, cropBox, rotation, flipH, flipV, brightness, contrast, saturation, maxDim, format, quality);
        setPreview(result);
        // Estimate file size from base64 length
        const base64 = result.split(",")[1] || "";
        setEstimatedSize(Math.round((base64.length * 3) / 4));
      } catch { /* ignore cross-origin preview errors */ }
    }, 300);
    return () => clearTimeout(id);
  }, [src, cropBox, rotation, flipH, flipV, brightness, contrast, saturation, maxDim, format, quality]);

  // ─────────────────────────────────────────────────────────────────
  // Pointer drag handlers for crop box
  // ─────────────────────────────────────────────────────────────────
  const getRelPos = useCallback((e: React.PointerEvent | PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      px: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      py: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  }, []);

  const clampBox = useCallback((b: CropBox, ar: AspectRatio): CropBox => {
    let { x, y, w, h } = b;
    w = Math.max(5, Math.min(w, 100 - x));
    h = Math.max(5, Math.min(h, 100 - y));
    x = Math.max(0, Math.min(x, 100 - w));
    y = Math.max(0, Math.min(y, 100 - h));
    const ratio = ASPECT_RATIOS[ar];
    if (ratio !== null) {
      // Enforce aspect ratio by adjusting height
      h = w / ratio;
      if (y + h > 100) { h = 100 - y; w = h * ratio; }
      if (x + w > 100) { w = 100 - x; h = w / ratio; }
    }
    return { x, y, w, h };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent, type: string) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { px, py } = getRelPos(e);
    dragRef.current = { type, startX: px, startY: py, origBox: { ...cropBox } };
  }, [cropBox, getRelPos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { type, startX, startY, origBox } = dragRef.current;
    const { px, py } = getRelPos(e);
    const dx = px - startX;
    const dy = py - startY;

    setCropBox(prev => {
      let { x, y, w, h } = origBox;
      switch (type) {
        case "move": x += dx; y += dy; break;
        case "new":  x = Math.min(startX, px); y = Math.min(startY, py); w = Math.abs(dx); h = Math.abs(dy); break;
        case "tl":   x += dx; y += dy; w -= dx; h -= dy; break;
        case "tr":   y += dy; w += dx; h -= dy; break;
        case "bl":   x += dx; w -= dx; h += dy; break;
        case "br":   w += dx; h += dy; break;
        case "t":    y += dy; h -= dy; break;
        case "b":    h += dy; break;
        case "l":    x += dx; w -= dx; break;
        case "r":    w += dx; break;
      }
      return clampBox({ x, y, w, h }, aspect);
    });
  }, [getRelPos, clampBox, aspect]);

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

  // ── Aspect ratio enforcement on change ──────────────────────────
  const changeAspect = (a: AspectRatio) => {
    setAspect(a);
    setCropBox(prev => clampBox(prev, a));
  };

  // ── Rotation helpers ─────────────────────────────────────────────
  const rotateLeft  = () => setRotation(r => (r - 90 + 360) % 360);
  const rotateRight = () => setRotation(r => (r + 90) % 360);
  const resetAll = () => {
    setCropBox({ x: 0, y: 0, w: 100, h: 100 });
    setRotation(0); setFlipH(false); setFlipV(false);
    setBrightness(100); setContrast(100); setSaturation(100);
  };

  // ── Save ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setProcessing(true);
    try {
      const url = await processImage(src, cropBox, rotation, flipH, flipV, brightness, contrast, saturation, maxDim, format, quality);
      const ext = format === "image/webp" ? "webp" : format === "image/jpeg" ? "jpg" : "png";
      const fname = (filename || slugify(productTitle || "product-image")) + "." + ext;
      onSave({ url, altText, filename: fname });
    } finally {
      setProcessing(false);
    }
  };

  // ── Slider component ─────────────────────────────────────────────
  const Slider = ({ label, value, min, max, onChange, unit = "" }: {
    label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string;
  }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <label className="text-[11px] font-semibold text-[#0C0D10]/60 uppercase tracking-widest">{label}</label>
        <span className="text-[12px] font-bold text-[#1160CB]">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-[#1160CB] cursor-pointer"
      />
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#F0F2F8]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1160CB] flex items-center justify-center">
              <ImageIcon size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[#0C0D10]">Image Editor</h2>
              <p className="text-[11px] text-[#0C0D10]/40">Crop · Enhance · Optimize · SEO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
            <X size={18} className="text-[#0C0D10]/50" />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b bg-white">
          {(["crop", "optimize", "seo"] as Tab[]).map(t => {
            const icons: Record<Tab, React.ReactNode> = {
              crop:     <Crop size={13} />,
              optimize: <Sliders size={13} />,
              seo:      <Globe size={13} />,
            };
            const labels: Record<Tab, string> = { crop: "Crop & Adjust", optimize: "Optimize", seo: "SEO" };
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-5 py-3 text-[12px] font-semibold border-b-2 transition-colors ${
                  tab === t ? "border-[#1160CB] text-[#1160CB]" : "border-transparent text-[#0C0D10]/40 hover:text-[#0C0D10]"
                }`}>
                {icons[t]} {labels[t]}
              </button>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">

          {/* ── Left: Canvas / Preview ── */}
          <div className="flex-1 bg-[#0E121A] flex items-center justify-center p-4 min-h-[260px]">
            {tab === "crop" ? (
              /* Interactive crop area */
              <div
                ref={containerRef}
                className="relative select-none"
                style={{ maxWidth: "100%", maxHeight: "420px", cursor: "crosshair" }}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onPointerDown={e => { if (e.target === containerRef.current || (e.target as HTMLElement).dataset.bg) onPointerDown(e, "new"); }}
              >
                <img
                  src={src}
                  alt="edit"
                  data-bg="1"
                  draggable={false}
                  className="block max-w-full max-h-[420px] object-contain"
                  style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }}
                />

                {/* Dim overlay with hole */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "transparent",
                    boxShadow: `inset 0 0 0 9999px rgba(0,0,0,0)`,
                  }}
                >
                  {/* The crop box itself */}
                  <div
                    className="absolute border-2 border-white"
                    style={{
                      left: `${cropBox.x}%`, top: `${cropBox.y}%`,
                      width: `${cropBox.w}%`, height: `${cropBox.h}%`,
                      boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                      cursor: "move",
                      pointerEvents: "all",
                    }}
                    onPointerDown={e => { e.stopPropagation(); onPointerDown(e, "move"); }}
                  >
                    {/* Rule-of-thirds grid */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "33.33% 33.33%" }} />

                    {/* 8 resize handles */}
                    {["tl","tr","bl","br","t","b","l","r"].map(h => {
                      const pos: Record<string, React.CSSProperties> = {
                        tl: { top: -5,   left: -5   }, tr: { top: -5,   right: -5  },
                        bl: { bottom:-5, left: -5   }, br: { bottom:-5, right: -5  },
                        t:  { top: -4,   left: "calc(50% - 4px)" },
                        b:  { bottom:-4, left: "calc(50% - 4px)" },
                        l:  { left: -4,  top: "calc(50% - 4px)"  },
                        r:  { right:-4,  top: "calc(50% - 4px)"  },
                      };
                      const cursors: Record<string, string> = {
                        tl:"nw-resize", tr:"ne-resize", bl:"sw-resize", br:"se-resize",
                        t:"n-resize", b:"s-resize", l:"w-resize", r:"e-resize",
                      };
                      return (
                        <div key={h}
                          className="absolute w-3 h-3 bg-white border-2 border-[#1160CB] rounded-sm"
                          style={{ ...pos[h], cursor: cursors[h] }}
                          onPointerDown={e => { e.stopPropagation(); onPointerDown(e, h); }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Static preview for Optimize / SEO tabs */
              <div className="text-center space-y-2">
                <img src={preview} alt="preview" className="max-w-full max-h-[380px] object-contain rounded-lg shadow-lg" />
                {estimatedSize !== null && (
                  <p className="text-[11px] text-white/50">
                    Estimated output: <span className="text-white/80 font-semibold">{formatBytes(estimatedSize)}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Controls panel ── */}
          <div className="w-full md:w-72 border-l bg-white overflow-y-auto p-4 space-y-5 flex-shrink-0">

            {/* ─── CROP & ADJUST ─── */}
            {tab === "crop" && (
              <>
                {/* Aspect ratio */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Aspect Ratio</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ASPECT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => changeAspect(o.value)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          aspect === o.value
                            ? "bg-[#1160CB] text-white border-[#1160CB]"
                            : "bg-white text-[#0C0D10]/60 border-[#F0F2F8] hover:border-[#1160CB]/40"
                        }`}>{o.label}</button>
                    ))}
                  </div>
                </div>

                {/* Transform buttons */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Transform</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <RotateCcw size={14}/>, label: "Rotate L", action: rotateLeft },
                      { icon: <RotateCw size={14}/>,  label: "Rotate R", action: rotateRight },
                      { icon: <FlipHorizontal size={14}/>, label: `Flip H${flipH ? " ✓" : ""}`, action: () => setFlipH(f => !f), active: flipH },
                      { icon: <FlipVertical size={14}/>,   label: `Flip V${flipV ? " ✓" : ""}`, action: () => setFlipV(f => !f), active: flipV },
                    ].map(btn => (
                      <button key={btn.label} onClick={btn.action}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          btn.active ? "bg-[#1160CB]/10 border-[#1160CB]/30 text-[#1160CB]" : "border-[#F0F2F8] text-[#0C0D10]/60 hover:border-[#1160CB]/40"
                        }`}>
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-[#0C0D10]/30 text-center">Rotation: {rotation}°</div>
                </div>

                {/* Adjustments */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Adjustments</label>
                  <Slider label="Brightness" value={brightness} min={0} max={200} onChange={setBrightness} unit="%" />
                  <Slider label="Contrast"   value={contrast}   min={0} max={200} onChange={setContrast}   unit="%" />
                  <Slider label="Saturation" value={saturation} min={0} max={200} onChange={setSaturation} unit="%" />
                </div>

                <button onClick={resetAll} className="flex items-center gap-1.5 text-[11px] text-[#0C0D10]/40 hover:text-red-500 transition-colors">
                  <RefreshCw size={11} /> Reset all
                </button>
              </>
            )}

            {/* ─── OPTIMIZE ─── */}
            {tab === "optimize" && (
              <>
                {/* Format */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Output Format</label>
                  <div className="flex gap-1.5">
                    {(["image/webp", "image/jpeg", "image/png"] as OutputFormat[]).map(f => {
                      const lbl = { "image/webp": "WebP", "image/jpeg": "JPEG", "image/png": "PNG" }[f];
                      return (
                        <button key={f} onClick={() => setFormat(f)}
                          className={`flex-1 py-2 rounded-lg text-[11px] font-bold border transition-all ${
                            format === f ? "bg-[#1160CB] text-white border-[#1160CB]" : "border-[#F0F2F8] text-[#0C0D10]/60 hover:border-[#1160CB]/40"
                          }`}>{lbl}</button>
                      );
                    })}
                  </div>
                  {format === "image/webp" && (
                    <p className="text-[10px] text-[#1160CB]/70">✦ WebP is recommended — up to 35% smaller than JPEG</p>
                  )}
                </div>

                {/* Quality */}
                {format !== "image/png" && (
                  <Slider label="Quality" value={quality} min={20} max={100} onChange={setQuality} unit="%" />
                )}

                {/* Max dimension */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Max Dimension</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DIM_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => setMaxDim(o.value)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          maxDim === o.value
                            ? "bg-[#1160CB] text-white border-[#1160CB]"
                            : "bg-white text-[#0C0D10]/60 border-[#F0F2F8] hover:border-[#1160CB]/40"
                        }`}>{o.label}</button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                {imgNaturalSize.w > 0 && (
                  <div className="p-3 rounded-xl bg-[#F0F2F8] space-y-1.5 text-[11px]">
                    <p className="font-bold text-[#0C0D10]/50 uppercase tracking-wider text-[9px]">Image Info</p>
                    <div className="flex justify-between"><span className="text-[#0C0D10]/50">Original</span><span className="font-semibold">{imgNaturalSize.w} × {imgNaturalSize.h}px</span></div>
                    {maxDim > 0 && (() => {
                      const scale = maxDim / Math.max(imgNaturalSize.w, imgNaturalSize.h);
                      const ow = Math.round(imgNaturalSize.w * scale);
                      const oh = Math.round(imgNaturalSize.h * scale);
                      return <div className="flex justify-between"><span className="text-[#0C0D10]/50">Output</span><span className="font-semibold text-[#1160CB]">{ow} × {oh}px</span></div>;
                    })()}
                    {estimatedSize !== null && (
                      <div className="flex justify-between"><span className="text-[#0C0D10]/50">Est. size</span><span className="font-semibold text-green-600">{formatBytes(estimatedSize)}</span></div>
                    )}
                  </div>
                )}

                {/* Best practices */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Best Practices</label>
                  {[
                    { ok: format === "image/webp",   tip: "Use WebP for best compression" },
                    { ok: quality <= 85,              tip: "Quality ≤ 85% for smaller files" },
                    { ok: maxDim > 0 && maxDim <= 800,tip: "Max 800px for product images" },
                  ].map(({ ok, tip }) => (
                    <div key={tip} className="flex items-start gap-2 text-[11px]">
                      <span className={ok ? "text-green-500" : "text-[#0C0D10]/20"}>
                        {ok ? "✓" : "○"}
                      </span>
                      <span className={ok ? "text-[#0C0D10]/70" : "text-[#0C0D10]/35"}>{tip}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ─── SEO ─── */}
            {tab === "seo" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">Alt Text</label>
                  <textarea
                    rows={3}
                    value={altText}
                    onChange={e => setAltText(e.target.value)}
                    placeholder="Describe the image for screen readers and search engines…"
                    className="w-full px-3 py-2 rounded-lg text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-[#1160CB]"
                    style={{ border: "1.5px solid #F0F2F8" }}
                  />
                  <p className="text-[10px] text-[#0C0D10]/30">{altText.length}/125 chars recommended</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">SEO Filename</label>
                  <div className="flex gap-1.5">
                    <input
                      value={filename}
                      onChange={e => setFilename(e.target.value.replace(/[^a-z0-9-]/g, ""))}
                      placeholder="product-name-color"
                      className="flex-1 h-9 px-3 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1160CB]"
                      style={{ border: "1.5px solid #F0F2F8" }}
                    />
                    <button
                      onClick={() => setFilename(slugify(productTitle || altText || "product-image"))}
                      className="px-3 rounded-lg text-[10px] font-bold text-[#1160CB] border border-[#1160CB]/20 hover:bg-[#1160CB]/5 whitespace-nowrap"
                    >Auto</button>
                  </div>
                  <p className="text-[10px] text-[#0C0D10]/30">Lowercase, hyphens only — no spaces or special chars</p>
                </div>

                {/* SEO checklist */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0C0D10]/50">SEO Checklist</label>
                  {[
                    { ok: altText.length >= 10 && altText.length <= 125, tip: "Alt text 10-125 characters" },
                    { ok: altText.toLowerCase().includes(productTitle.toLowerCase().split(" ")[0] || "x"), tip: "Alt text includes product name" },
                    { ok: filename.length > 3 && !filename.startsWith("img") && !filename.startsWith("dsc"), tip: "Descriptive filename (not img001)" },
                    { ok: format === "image/webp", tip: "WebP format for faster load" },
                    { ok: maxDim > 0 && maxDim <= 800, tip: "Dimensions optimised (≤800px)" },
                  ].map(({ ok, tip }) => (
                    <div key={tip} className="flex items-start gap-2 text-[11px]">
                      <span className={ok ? "text-green-500" : "text-[#0C0D10]/20"}>{ok ? "✓" : "○"}</span>
                      <span className={ok ? "text-[#0C0D10]/70" : "text-[#0C0D10]/35"}>{tip}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t bg-[#F0F2F8]/40">
          <button onClick={onClose} className="text-[12px] text-[#0C0D10]/40 hover:text-[#0C0D10] transition-colors">
            Discard
          </button>
          <div className="flex items-center gap-2">
            {estimatedSize !== null && (
              <span className="text-[11px] text-[#0C0D10]/40 mr-2">
                Output ~{formatBytes(estimatedSize)}
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={processing}
              className="gap-2 bg-[#1160CB] hover:bg-[#1528A1] text-white h-9 px-5 rounded-lg text-[12px] font-bold"
            >
              {processing ? <><RefreshCw size={13} className="animate-spin" /> Processing…</> : <><Check size={13} /> Apply & Save</>}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageEditorModal;
