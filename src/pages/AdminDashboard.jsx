import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, PlusCircle, Loader2, Search, Trash2, BookOpen,
  XCircle, CheckCircle, X, Calendar, ShieldCheck, LogOut,
  Users, Clock, AlertCircle, Home, BarChart2, TrendingUp,
  Bell, ChevronRight,
} from "lucide-react";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import { RegistrationPanel, EditUserPanel } from "./AdminDashboard_Part2";
import { StudentSelectionView, ClassSchedulingForm } from "./AdminDashboard_Part3";
import { CurriculumManager } from "./AdminDashboard_Part5";
import { ClassesOverview } from "./AdminDashboard_Part4";
import PearlxLogo from "../assets/flat_logo.webp";

// Design Tokens (same as Tutor/Student)
const C = {
  bg: "#F4F6FB",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E5E9F2",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  emerald: "#10B981",
  emeraldLight: "#ECFDF5",
  emeraldDark: "#059669",
  cyan: "#0EA5E9",
  cyanLight: "#E0F2FE",
  indigo: "#6366F1",
  indigoLight: "#EEF2FF",
  red: "#EF4444",
  redLight: "#FEF2F2",
  amber: "#F59E0B",
  amberLight: "#FFFBEB",
  violet: "#8B5CF6",
  violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  gradIndigo: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  gradRed: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  gradAmber: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  gradViolet: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowHover: "0 8px 24px rgba(15,23,42,0.1)",
};

// Export C so sub-components can import it
export { C };

const roleBadge = (role) => {
  const map = {
    admin:   { bg: C.redLight,    color: C.red,    label: "Admin" },
    tutor:   { bg: C.violetLight, color: C.violet, label: "Tutor" },
    student: { bg: C.indigoLight, color: C.indigo, label: "Student" },
  };
  return map[role] || map.student;
};

// Sidebar nav item 
const SideNavItem = ({ tab, active, onClick }) => (
  <motion.button onClick={onClick} whileTap={{ scale: 0.97 }}
    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: `1px solid ${active ? C.emerald + "30" : "transparent"}`, background: active ? C.emeraldLight : "transparent", cursor: "pointer", transition: "all 0.15s" }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: active ? C.emerald : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <tab.icon style={{ width: 16, height: 16, color: active ? "#fff" : C.textMuted }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 600, color: active ? C.textPrimary : C.textSecondary, flex: 1, textAlign: "left" }}>{tab.label}</span>
    {tab.count !== undefined && (
      <span style={{ background: active ? C.emerald : C.border, color: active ? "#fff" : C.textMuted, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{tab.count}</span>
    )}
  </motion.button>
);

// Stat Card
const StatCard = ({ icon: Icon, label, value, light, iconColor, onClick }) => (
  <motion.div whileHover={{ y: -2, boxShadow: C.shadowHover }} onClick={onClick}
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: C.shadowCard, cursor: onClick ? "pointer" : "default" }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: light, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <Icon style={{ width: 20, height: 20, color: iconColor }} />
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 4 }}>{label}</div>
  </motion.div>
);

// User List
function UserList({ users, isLoadingUsers, userError, setActiveView, adminDeleteUser, currentAdminUid, setSelectedUserToEdit }) {
  const [search, setSearch]     = useState("");
  const [filterRole, setFilter] = useState("all");
  const [isDeleting, setDel]    = useState(false);

  const filtered = users.filter(u => {
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name || "").toLowerCase().includes(q) ||
           (u.email || "").toLowerCase().includes(q) ||
           (u.customId || "").toLowerCase().includes(q);
  });

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
    setDel(true);
    const res = await adminDeleteUser(user.uid || user.id);
    setDel(false);
    alert(res.success ? `Deleted: ${user.name}` : `Failed: ${res.error}`);
  };

  const stats = {
    all:     users.length,
    student: users.filter(u => u.role === "student").length,
    tutor:   users.filter(u => u.role === "tutor").length,
    admin:   users.filter(u => u.role === "admin").length,
  };

  return (
    <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, borderBottom: `1px solid ${C.border}`, background: C.border }}>
        {[
          { label: "All Users", value: stats.all,     color: C.indigo,  bg: C.indigoLight },
          { label: "Students",  value: stats.student, color: C.cyan,    bg: C.cyanLight },
          { label: "Tutors",    value: stats.tutor,   color: C.violet,  bg: C.violetLight },
          { label: "Admins",    value: stats.admin,   color: C.red,     bg: C.redLight },
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, padding: "18px 20px" }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search style={{ width: 15, height: 15, color: C.textMuted, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
        <select value={filterRole} onChange={e => setFilter(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit" }}>
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="admin">Admins</option>
        </select>
        <motion.button onClick={() => setActiveView("register")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          <PlusCircle style={{ width: 15, height: 15 }} /> Register User
        </motion.button>
      </div>

      {/* Table */}
      {isLoadingUsers ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} />
        </div>
      ) : userError ? (
        <div style={{ margin: 20, padding: "12px 16px", borderRadius: 12, background: C.redLight, border: `1px solid ${C.red}25`, display: "flex", gap: 8, alignItems: "center" }}>
          <AlertCircle style={{ width: 16, height: 16, color: C.red }} />
          <p style={{ fontSize: 13, color: C.red }}>{userError}</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Role", "Name / ID", "Email", "Details", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: "48px", textAlign: "center", fontSize: 13, color: C.textMuted }}>No users found</td></tr>
              ) : filtered.map(u => {
                const b = roleBadge(u.role);
                const isSelf = (u.uid || u.id) === currentAdminUid;
                return (
                  <motion.tr key={u.uid || u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.bg, color: b.color }}>{b.label}</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{u.name}</p>
                      <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{u.customId || "—"}</p>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: C.textSecondary }}>{u.email}</td>
                    <td style={{ padding: "14px 18px", fontSize: 12, color: C.textMuted }}>
                      {u.role === "student" && u.classLevel && <span>Grade {u.classLevel}</span>}
                      {u.role === "tutor" && u.subjects?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {u.subjects.slice(0, 3).map((s, i) => (
                            <span key={i} style={{ padding: "2px 8px", borderRadius: 20, background: C.cyanLight, color: C.cyan, fontSize: 11, fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <motion.button onClick={() => { setSelectedUserToEdit(u); setActiveView("edit"); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          style={{ width: 32, height: 32, borderRadius: 8, background: C.cyanLight, border: `1px solid ${C.cyan}25`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Edit">
                          <Pencil style={{ width: 13, height: 13, color: C.cyan }} />
                        </motion.button>
                        {isSelf ? (
                          <span style={{ fontSize: 11, color: C.textMuted }}>You</span>
                        ) : (
                          <motion.button onClick={() => handleDelete(u)} disabled={isDeleting} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            style={{ width: 32, height: 32, borderRadius: 8, background: C.redLight, border: `1px solid ${C.red}25`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: isDeleting ? 0.4 : 1 }} title="Delete">
                            <Trash2 style={{ width: 13, height: 13, color: C.red }} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Overview Dashboard 
function OverviewTab({ users, classes, setActiveView }) {
  const students = users.filter(u => u.role === "student");
  const tutors   = users.filter(u => u.role === "tutor");
  const scheduledClasses  = classes.filter(c => c.status === "scheduled" || c.status === "pending");
  const completedClasses  = classes.filter(c => c.status === "completed");
  const missedClasses     = classes.filter(c => c.status === "missed");

  const recentUsers = [...users].slice(0, 5);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 14 }}>
        <StatCard icon={Users}       label="Total Users"       value={users.length}           light={C.indigoLight}  iconColor={C.indigo}  onClick={() => setActiveView("list")} />
        <StatCard icon={BookOpen}    label="Active Students"   value={students.length}        light={C.cyanLight}    iconColor={C.cyan}    onClick={() => setActiveView("list")} />
        <StatCard icon={ShieldCheck} label="Tutors"            value={tutors.length}          light={C.violetLight}  iconColor={C.violet}  onClick={() => setActiveView("list")} />
        <StatCard icon={Calendar}    label="Total Classes"     value={classes.length}         light={C.emeraldLight} iconColor={C.emerald} onClick={() => setActiveView("classes-list")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard icon={Clock}       label="Scheduled Classes" value={scheduledClasses.length}  light={C.indigoLight}  iconColor={C.indigo} />
        <StatCard icon={CheckCircle} label="Completed Classes" value={completedClasses.length}  light={C.emeraldLight} iconColor={C.emerald} />
        <StatCard icon={XCircle}     label="Missed Classes"    value={missedClasses.length}     light={C.redLight}     iconColor={C.red} />
      </div>

      {/* Two cols */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Users */}
        <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowCard }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 6 }}>
              <Users style={{ width: 15, height: 15, color: C.indigo }} />Recent Users
            </h3>
            <button onClick={() => setActiveView("list")} style={{ fontSize: 12, color: C.indigo, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentUsers.map(u => {
              const b = roleBadge(u.role);
              return (
                <div key={u.uid || u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: C.bg }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{u.name?.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                    <p style={{ fontSize: 12, color: C.textMuted }}>{u.email}</p>
                  </div>
                  <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.bg, color: b.color }}>{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowCard }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Register New User", icon: PlusCircle, color: C.emerald, bg: C.emeraldLight, view: "register" },
                { label: "Schedule a Class",  icon: Calendar,   color: C.indigo,  bg: C.indigoLight,  view: "schedule" },
                { label: "View All Classes",  icon: BookOpen,   color: C.cyan,    bg: C.cyanLight,    view: "classes-list" },
                { label: "User Management",   icon: Users,      color: C.violet,  bg: C.violetLight,  view: "list" },
              ].map(action => (
                <motion.button key={action.view} onClick={() => setActiveView(action.view)} whileHover={{ x: 4 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: action.bg, border: `1px solid ${action.color}20`, cursor: "pointer" }}>
                  <action.icon style={{ width: 16, height: 16, color: action.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: action.color }}>{action.label}</span>
                  <ChevronRight style={{ width: 14, height: 14, color: action.color, marginLeft: "auto" }} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Class summary */}
          <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowCard }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 14 }}>Class Breakdown</h3>
            {[
              { label: "Completed", value: completedClasses.length, total: classes.length, color: C.emerald, bg: C.emeraldLight },
              { label: "Missed",    value: missedClasses.length,    total: classes.length, color: C.red,     bg: C.redLight },
              { label: "Scheduled", value: scheduledClasses.length, total: classes.length, color: C.indigo,  bg: C.indigoLight },
            ].map(item => {
              const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 6, background: item.bg, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                      style={{ height: "100%", borderRadius: 6, background: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main 
export default function AdminDashboard() {
  const { adminRegisterUser, adminDeleteUser, adminDeleteClass, adminUpdateUser, adminScheduleClass, logout, role, userId } = useAuth();

  const [allTutors, setAllTutors]                   = useState([]);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [adminProfile, setAdminProfile]             = useState(null);
  const [activeView, setActiveView]                 = useState("overview");
  const [users, setUsers]                           = useState([]);
  const [allClasses, setAllClasses]                 = useState([]);
  const [isLoadingUsers, setIsLoadingUsers]         = useState(true);
  const [userError, setUserError]                   = useState(null);
  const [selectedStudentToSchedule, setSelStudent]  = useState(null);

  const initialFormState = {
  name: "", email: "", password: "", contactNumber: "", emergencyContact: "",
  classLevel: "", grade: "",          
  subjects: [], qualifications: "", hourlyRate: "",
  availability: "", timezone: "Asia/Kolkata", permanentClassLink: "",
};

  const [form, setForm]               = useState(initialFormState);
  const [regRole, setRegRole]         = useState("student");
  const [regStatus, setRegStatus]     = useState(null);
  const [regLoading, setRegLoading]   = useState(false);

  // Load users
  useEffect(() => {
    setIsLoadingUsers(true);
    return onSnapshot(collection(db, "userSummaries"), snap => {
      const arr = snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
      arr.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setUsers(arr); setIsLoadingUsers(false);
    }, () => { setUserError("Failed to load users."); setIsLoadingUsers(false); });
  }, []);

  // Load all classes for overview stats
  useEffect(() => {
    return onSnapshot(collection(db, "classes"), snap => {
      setAllClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Load tutors
  useEffect(() => {
    return onSnapshot(query(collection(db, "userSummaries"), where("role", "==", "tutor")), snap => {
      setAllTutors(snap.docs.map(d => ({ uid: d.id, name: d.data().name, subjects: d.data().subjects || [] })));
    });
  }, []);

  // Admin profile
  useEffect(() => {
    if (!userId) return;
    getDoc(doc(db, "userSummaries", userId)).then(snap => { if (snap.exists()) setAdminProfile(snap.data()); });
  }, [userId]);

  const handleFormChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const students = users.filter(u => u.role === "student");

  const tabs = [
    { id: "overview",      label: "Overview",      icon: Home },
    { id: "list",          label: "Users",         icon: Users,     count: users.length },
    { id: "classes-list",  label: "Classes",       icon: BookOpen,  count: allClasses.length },
    { id: "register",      label: "Register User", icon: PlusCircle },
    { id: "schedule",      label: "Schedule Class",icon: Calendar },
     { id: "curriculum", label: "Curriculum", icon: BookOpen },
  ];

  if (role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <div style={{ textAlign: "center", padding: 40, borderRadius: 24, background: C.card, border: `1px solid ${C.border}` }}>
          <ShieldCheck style={{ width: 48, height: 48, margin: "0 auto 12px", color: C.red }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 6 }}>Access Denied</h2>
          <p style={{ fontSize: 14, color: C.textMuted }}>This panel is for admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 256, minWidth: 256, height: "100vh", background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
          <img src={PearlxLogo} alt="Pearlx" style={{ height: 40, width: "auto", objectFit: "contain" }} />
        </div>

        {/* Admin info */}
        <div style={{ padding: "16px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: C.gradIndigo, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>
              {adminProfile?.name?.charAt(0) || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminProfile?.name || "Admin"}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: C.redLight }}>
                <ShieldCheck style={{ width: 11, height: 11, color: C.red }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.red }}>Administrator</span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ padding: "9px 6px", borderRadius: 10, background: C.indigoLight, textAlign: "center" }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: C.indigo }}>{users.length}</p>
              <p style={{ fontSize: 11, color: C.textMuted }}>Users</p>
            </div>
            <div style={{ padding: "9px 6px", borderRadius: 10, background: C.emeraldLight, textAlign: "center" }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: C.emerald }}>{allClasses.length}</p>
              <p style={{ fontSize: 11, color: C.textMuted }}>Classes</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 6px 8px" }}>MAIN MENU</p>
          {tabs.map(tab => (
            <SideNavItem key={tab.id} tab={tab}
              active={activeView === tab.id || (activeView === "edit" && tab.id === "list")}
              onClick={() => { setActiveView(tab.id); setSelStudent(null); }} />
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
          <motion.button onClick={logout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, border: `1px solid ${C.red}20`, background: C.redLight, color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <LogOut style={{ width: 16, height: 16 }} /> Logout
          </motion.button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 62, background: "rgba(244,246,251,0.96)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>
              {tabs.find(t => t.id === activeView)?.label || (activeView === "edit" ? "Edit User" : "Admin Portal")}
            </h1>
            <p style={{ fontSize: 12, color: C.textMuted }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "6px 14px", borderRadius: 20, background: C.indigoLight, border: `1px solid ${C.indigo}20` }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo }}>Admin Portal</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: C.gradIndigo, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
              {adminProfile?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <AnimatePresence mode="wait">

            {activeView === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <OverviewTab users={users} classes={allClasses} setActiveView={setActiveView} />
              </motion.div>
            )}

            {activeView === "list" && (
              <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>User Management</h2>
                  <p style={{ fontSize: 13, color: C.textMuted }}>{users.length} total users registered</p>
                </div>
                <UserList users={users} isLoadingUsers={isLoadingUsers} userError={userError}
                  setActiveView={setActiveView} adminDeleteUser={adminDeleteUser}
                  currentAdminUid={userId} setSelectedUserToEdit={setSelectedUserToEdit} />
              </motion.div>
            )}

            {activeView === "classes-list" && (
              <motion.div key="classes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ClassesOverview setActiveView={setActiveView} adminDeleteClass={adminDeleteClass} />
              </motion.div>
            )}

            {activeView === "register" && (
              <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <RegistrationPanel form={form} regRole={regRole} regStatus={regStatus} regLoading={regLoading}
                  handleFormChange={handleFormChange} setRegRole={setRegRole} setActiveView={setActiveView}
                  setRegStatus={setRegStatus} tutors={allTutors} setForm={setForm} initialFormState={initialFormState}
                  adminRegisterUser={adminRegisterUser} setRegLoading={setRegLoading} />
              </motion.div>
            )}

            {activeView === "edit" && selectedUserToEdit && (
              <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <EditUserPanel user={selectedUserToEdit} setActiveView={setActiveView}
                  tutors={allTutors} adminUpdateUser={adminUpdateUser} />
              </motion.div>
            )}

            {activeView === "schedule" && !selectedStudentToSchedule && (
              <motion.div key="sched-sel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <StudentSelectionView students={students} onSelectStudent={setSelStudent} setActiveView={setActiveView} />
              </motion.div>
            )}

            {activeView === "schedule" && selectedStudentToSchedule && (
              <ClassSchedulingForm key="sched-form"
                selectedStudent={selectedStudentToSchedule}
                onBack={() => setSelStudent(null)}
                adminScheduleClass={adminScheduleClass}
                setActiveView={setActiveView} />
            )}
             {activeView === "curriculum" && <CurriculumManager />}
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px}`}</style>
    </div>
  );
}