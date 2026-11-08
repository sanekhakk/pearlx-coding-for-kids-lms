import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee, Search, Loader2, AlertCircle, CheckCircle, Clock,
  X, Download, Calendar, RefreshCw, Receipt as ReceiptIcon,
} from "lucide-react";
import { auth } from "../firebase";
import ReceiptDocument from "../components/ReceiptDocument";
import { downloadReceiptAsPdf } from "../utils/downloadReceiptPdf";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://brainbugz-learning-management-system.onrender.com";

const C = {
  bg: "#F2F8FC", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  red: "#EF4444", redLight: "#FEF2F2",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  shadowCard: "0 4px 0 rgba(15,23,42,0.05), 0 8px 22px rgba(15,23,42,0.04)",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
};

function formatDate(ts) {
  if (!ts) return "";
  const date = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const MiniStat = ({ icon: Icon, label, value, light, iconColor }) => (
  <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", boxShadow: C.shadowCard }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: light, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
      <Icon style={{ width: 18, height: 18, color: iconColor }} />
    </div>
    <p style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{value}</p>
    <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{label}</p>
  </div>
);

const ReceiptRow = ({ receipt, onToggleStatus, isUpdating, onView }) => {
  const isPaid = receipt.status === "paid";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: C.card, border: `2px solid ${C.border}`, boxShadow: C.shadowCard, flexWrap: "wrap" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: isPaid ? C.emeraldLight : C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <ReceiptIcon style={{ width: 18, height: 18, color: isPaid ? C.emerald : C.amber }} />
      </div>
      <div style={{ flex: 1, minWidth: 180, cursor: "pointer" }} onClick={() => onView(receipt)}>
        <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
          {receipt.studentName} <span style={{ fontWeight: 500, color: C.textMuted }}>· {receipt.receiptId}</span>
        </p>
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <Calendar style={{ width: 11, height: 11 }} /> Generated {formatDate(receipt.generatedAt)} · {receipt.totalClasses} classes
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontWeight: 800, fontSize: 16, color: C.textPrimary }}>{formatCurrency(receipt.totalAmount)}</p>
      </div>
      <button onClick={() => onToggleStatus(receipt)} disabled={isUpdating}
        style={{
          flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: "none",
          background: isPaid ? C.amberLight : C.gradEmerald, color: isPaid ? C.amber : "#fff",
          fontWeight: 700, fontSize: 12, cursor: isUpdating ? "default" : "pointer", opacity: isUpdating ? 0.6 : 1,
        }}>
        {isUpdating ? (
          <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />
        ) : isPaid ? (
          <><Clock style={{ width: 13, height: 13 }} /> Mark Unpaid</>
        ) : (
          <><CheckCircle style={{ width: 13, height: 13 }} /> Mark Paid</>
        )}
      </button>
    </div>
  );
};

// MAIN PAYMENT HISTORY VIEW
// Lists every fee receipt ever generated, across every student, with a
// one-click way to flip a receipt between unpaid/paid once a parent has
// actually settled it — that status is exactly what the student's own
// Fee Receipts section reads and displays.
export function PaymentHistory() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const loadReceipts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/receipts/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load payment history");
      setReceipts(data.receipts);
    } catch (err) {
      console.error("load payment history err:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReceipts(); }, []);

  const handleToggleStatus = async (receipt) => {
    const newStatus = receipt.status === "paid" ? "unpaid" : "paid";
    setUpdatingId(receipt.id);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/receipts/${receipt.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update status");
      setReceipts(prev => prev.map(r => r.id === receipt.id ? { ...r, status: newStatus } : r));
      setSelected(prev => (prev && prev.id === receipt.id) ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      console.error("update receipt status err:", err);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadReceiptAsPdf(receiptRef.current, `PearlX-Receipt-${selected.receiptId}.pdf`);
    } catch (err) {
      console.error("download receipt err:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const filtered = receipts.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (r.studentName || "").toLowerCase().includes(q) ||
      (r.receiptId || "").toLowerCase().includes(q) ||
      (r.studentCustomId || "").toLowerCase().includes(q);
  });

  const totalPaid = receipts.filter(r => r.status === "paid").reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalUnpaid = receipts.filter(r => r.status !== "paid").reduce((s, r) => s + (r.totalAmount || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>Payment History</h2>
        <p style={{ fontSize: 13, color: C.textMuted }}>Every fee receipt generated across all students — mark one as paid once a parent has settled it.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <MiniStat icon={ReceiptIcon} label="Total Receipts" value={receipts.length} light={C.indigoLight} iconColor={C.indigo} />
        <MiniStat icon={CheckCircle} label="Paid" value={formatCurrency(totalPaid)} light={C.emeraldLight} iconColor={C.emerald} />
        <MiniStat icon={Clock} label="Unpaid" value={formatCurrency(totalUnpaid)} light={C.amberLight} iconColor={C.amber} />
      </div>

      <div style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `2px solid ${C.border}`, boxShadow: C.shadowCard, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search style={{ width: 15, height: 15, color: C.textMuted, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student name, ID, or receipt ID..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit" }}>
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <button onClick={loadReceipts} title="Refresh"
          style={{ padding: 9, borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, cursor: "pointer", display: "flex" }}>
          <RefreshCw style={{ width: 15, height: 15, color: C.textMuted }} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} />
        </div>
      ) : error ? (
        <div style={{ padding: "16px 20px", borderRadius: 14, background: C.redLight, border: `1px solid ${C.red}25`, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle style={{ width: 16, height: 16, color: C.red }} />
          <p style={{ fontSize: 13, color: C.red }}>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", borderRadius: 16, background: C.card, border: `2px solid ${C.border}` }}>
          <ReceiptIcon style={{ width: 40, height: 40, margin: "0 auto 12px", color: C.textMuted, opacity: 0.4 }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: C.textMuted }}>{search || statusFilter !== "all" ? "No receipts match your filters" : "No receipts generated yet"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(r => (
            <ReceiptRow key={r.id} receipt={r} onToggleStatus={handleToggleStatus} isUpdating={updatingId === r.id} onView={setSelected} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: C.card, borderRadius: 20, boxShadow: C.shadowModal, width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `2px solid ${C.border}`, position: "sticky", top: 0, background: C.card, zIndex: 1 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{selected.receiptId}</h2>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X style={{ width: 20, height: 20, color: C.textMuted }} />
                </button>
              </div>

              <div style={{ padding: 24 }}>
                <div style={{ border: `2px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 18, background: "#F8FAFC" }}>
                  <div style={{ transform: "scale(0.92)", transformOrigin: "top center", padding: "16px 0" }}>
                    <ReceiptDocument ref={receiptRef} receipt={selected} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <motion.button onClick={handleDownload} disabled={isDownloading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, border: "none", background: C.gradEmerald, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: isDownloading ? 0.7 : 1 }}>
                    {isDownloading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Download style={{ width: 16, height: 16 }} />}
                    {isDownloading ? "Preparing PDF..." : "Download PDF"}
                  </motion.button>
                  <button onClick={() => handleToggleStatus(selected)} disabled={updatingId === selected.id}
                    style={{ padding: "12px 20px", borderRadius: 12, border: "none", background: selected.status === "paid" ? C.amberLight : C.gradEmerald, color: selected.status === "paid" ? C.amber : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    {selected.status === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}