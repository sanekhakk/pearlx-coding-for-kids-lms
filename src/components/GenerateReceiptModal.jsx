import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, Loader2, AlertCircle, Download, IndianRupee, Calendar } from "lucide-react";
import { auth } from "../firebase";
import ReceiptDocument from "./ReceiptDocument";
import { downloadReceiptAsPdf } from "../utils/downloadReceiptPdf";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://brainbugz-learning-management-system.onrender.com";

const C = {
  bg: "#F2F8FC", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  red: "#EF4444", redLight: "#FEF2F2",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
};

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: `2px solid ${C.border}`,
  background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

/**
 * GenerateReceiptModal
 * Step 1: admin enters fee/hour (+ optional billing period), hits Generate.
 * Step 2: shows the formatted receipt with a Download PDF button.
 *
 * Props:
 *   student - { uid, name, customId, classLevel, category, ... } (from userSummaries)
 *   onClose - () => void
 */
export default function GenerateReceiptModal({ student, onClose }) {
  const [feePerHour, setFeePerHour] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const receiptRef = useRef(null);

  const handleGenerate = async () => {
    setError(null);
    const rate = Number(feePerHour);
    if (!feePerHour || isNaN(rate) || rate <= 0) {
      setError("Please enter a valid fee per hour");
      return;
    }
    if (periodFrom && periodTo && periodFrom > periodTo) {
      setError("Start date cannot be after end date");
      return;
    }

    setIsGenerating(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/receipts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          studentId: student.uid,
          feePerHour: rate,
          periodFrom: periodFrom || null,
          periodTo: periodTo || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate receipt");
      setReceipt(data.receipt);
    } catch (err) {
      console.error("generate receipt err:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadReceiptAsPdf(receiptRef.current, `PearlX-Receipt-${receipt.receiptId}.pdf`);
    } catch (err) {
      console.error("download receipt err:", err);
      setError("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{ background: C.card, borderRadius: 20, boxShadow: C.shadowModal, width: "100%", maxWidth: receipt ? 800 : 460, maxHeight: "90vh", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `2px solid ${C.border}`, position: "sticky", top: 0, background: C.card, zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Receipt style={{ width: 18, height: 18, color: C.emerald }} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{receipt ? "Receipt Generated" : "Generate Fee Receipt"}</h2>
                <p style={{ fontSize: 12, color: C.textMuted }}>{student.name} · {student.customId}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X style={{ width: 20, height: 20, color: C.textMuted }} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 24 }}>
            {!receipt ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 13, color: C.textSecondary }}>
                  This bills every class marked <strong>completed</strong> for {student.name}
                  {periodFrom || periodTo ? " within the selected period" : " to date"} at 1 hour per class.
                </p>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <IndianRupee style={{ width: 12, height: 12 }} /> Fee per Hour (₹)
                  </label>
                  <input type="number" min="1" step="1" value={feePerHour} onChange={e => setFeePerHour(e.target.value)}
                    placeholder="e.g. 500" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <Calendar style={{ width: 12, height: 12 }} /> Billing Period (optional)
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} style={inputStyle} />
                    <input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} style={inputStyle} />
                  </div>
                  <p style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Leave blank to bill all completed classes to date.</p>
                </div>

                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: C.redLight, border: `1px solid ${C.red}25`, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle style={{ width: 15, height: 15, color: C.red, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: C.red }}>{error}</p>
                  </div>
                )}

                <motion.button onClick={handleGenerate} disabled={isGenerating} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, border: "none", background: C.gradEmerald, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: isGenerating ? 0.7 : 1 }}>
                  {isGenerating ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Generating...</> : <><Receipt style={{ width: 16, height: 16 }} /> Generate Receipt</>}
                </motion.button>
              </div>
            ) : (
              <div>
                <div style={{ border: `2px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 18, background: "#F8FAFC" }}>
                  <div style={{ transform: "scale(0.92)", transformOrigin: "top center", padding: "16px 0" }}>
                    <ReceiptDocument ref={receiptRef} receipt={receipt} />
                  </div>
                </div>

                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: C.redLight, border: `1px solid ${C.red}25`, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <AlertCircle style={{ width: 15, height: 15, color: C.red, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: C.red }}>{error}</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <motion.button onClick={handleDownload} disabled={isDownloading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, border: "none", background: C.gradEmerald, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: isDownloading ? 0.7 : 1 }}>
                    {isDownloading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Download style={{ width: 16, height: 16 }} />}
                    {isDownloading ? "Preparing PDF..." : "Download PDF"}
                  </motion.button>
                  <button onClick={onClose}
                    style={{ padding: "12px 20px", borderRadius: 12, border: `2px solid ${C.border}`, background: C.card, color: C.textSecondary, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                    Close
                  </button>
                </div>
                <p style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 10 }}>
                  This receipt has been saved and is now visible in {student.name}'s dashboard.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}