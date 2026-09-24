import React from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { resolveAvatarUrl } from "../utils/defaultAvatars";

// One place that decides what a user's "profile picture" looks like:
//   student → the avatar they picked from the default gallery (initial fallback)
//   tutor   → fixed tutor icon (no photo)
//   admin   → fixed admin icon (no photo)
const ROLE_STYLE = {
  tutor: { bg: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)", Icon: GraduationCap },
  admin: { bg: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", Icon: ShieldCheck },
};

export default function RoleAvatar({ role, photoURL, name, size = 34, radius = "50%" }) {
  const base = {
    width: size, height: size, borderRadius: radius, overflow: "hidden", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  const roleStyle = ROLE_STYLE[role];
  if (roleStyle) {
    const { Icon, bg } = roleStyle;
    return (
      <div style={{ ...base, background: bg }}>
        <Icon style={{ width: Math.round(size * 0.52), height: Math.round(size * 0.52), color: "#fff" }} />
      </div>
    );
  }

  const url = resolveAvatarUrl(photoURL);
  return (
    <div style={{ ...base, background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)" }}>
      {url ? (
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <span style={{ color: "#fff", fontWeight: 800, fontSize: Math.round(size * 0.38) }}>
          {name?.charAt(0)?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}