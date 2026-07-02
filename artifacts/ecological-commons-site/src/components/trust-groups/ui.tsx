import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

const FONT = { fontFamily: "'Inter', sans-serif" };

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const sizes = size === "sm" ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2";
  const variants: Record<string, string> = {
    default: "bg-[var(--color-link)] text-white hover:bg-[var(--color-link-hover)]",
    outline: "border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-nav)]",
    destructive: "bg-[#b3261e] text-white hover:bg-[#8c1e17]",
    ghost: "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
  };
  return (
    <button
      style={FONT}
      className={`${base} ${sizes} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={FONT}
      className={`flex w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] shadow-sm placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-link)] ${className}`}
      {...rest}
    />
  );
}

export function Label({ className = "", children, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      style={FONT}
      className={`text-sm font-medium text-[var(--color-text)] ${className}`}
      {...rest}
    >
      {children}
    </label>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <p
      style={FONT}
      className="flex items-center gap-2 text-sm text-[#b3261e] bg-[#b3261e]/10 border border-[#b3261e]/20 rounded-lg px-3 py-2"
    >
      {message}
    </p>
  );
}
