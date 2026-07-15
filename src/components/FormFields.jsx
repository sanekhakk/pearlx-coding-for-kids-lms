import React from "react";
import { ChevronDown } from "lucide-react";
import { DARK as D } from "../utils/theme";

const inputBase = {
  background: D.surfaceAlt,
  border: `1px solid ${D.border}`,
  color: D.textPrimary,
  borderRadius: "0.75rem",
};

export const InputField = ({
  label, name, value, onChange, type = "text",
  required = false, placeholder = "", readOnly = false, disabled = false
}) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: D.textSecondary }} htmlFor={name}>
      {label} {required && <span style={{ color: D.red }}>*</span>}
    </label>
    <input
      type={type} id={name} name={name} required={required}
      value={value} onChange={onChange} readOnly={readOnly} disabled={disabled}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 text-sm outline-none transition-all"
      style={{ ...inputBase, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text" }}
      onFocus={e => { e.currentTarget.style.borderColor = D.indigo; e.currentTarget.style.boxShadow = D.shadowGlow; }}
      onBlur={e => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.boxShadow = "none"; }}
    />
  </div>
);

export const TextareaField = ({
  label, name, value, onChange, required = false, placeholder = "", rows = 3
}) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: D.textSecondary }} htmlFor={name}>
      {label} {required && <span style={{ color: D.red }}>*</span>}
    </label>
    <textarea
      id={name} name={name} required={required}
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-2.5 text-sm outline-none transition-all resize-none"
      style={inputBase}
      onFocus={e => { e.currentTarget.style.borderColor = D.indigo; e.currentTarget.style.boxShadow = D.shadowGlow; }}
      onBlur={e => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.boxShadow = "none"; }}
    />
  </div>
);

export const SelectField = ({ label, name, value, onChange, options = [], required = false }) => (
  <div className="relative">
    <label className="block text-sm font-medium mb-1.5" style={{ color: D.textSecondary }} htmlFor={name}>
      {label} {required && <span style={{ color: D.red }}>*</span>}
    </label>
    <select
      id={name} name={name} required={required} value={value} onChange={onChange}
      className="w-full px-4 py-2.5 text-sm outline-none transition-all appearance-none pr-10"
      style={inputBase}
      onFocus={e => { e.currentTarget.style.borderColor = D.indigo; }}
      onBlur={e => { e.currentTarget.style.borderColor = D.border; }}
    >
      {(!value || value === "") && <option value="" disabled>Select an option</option>}
      {options.map(opt => (
        <option key={opt.value ?? opt} value={opt.value ?? opt} style={{ background: D.surface }}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-[38px] pointer-events-none" style={{ color: D.textMuted }} />
  </div>
);