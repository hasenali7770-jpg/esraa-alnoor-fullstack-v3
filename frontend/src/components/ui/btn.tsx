"use client";
import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "ghost";
};
export function Btn({ children, href, onClick, className="", variant="solid" }: Props){
  const base = "inline-flex items-center justify-center rounded-xl2 px-4 py-2 text-sm font-bold transition";
  const solid = "bg-[color:var(--accent)] text-white hover:opacity-90";
  const ghost = "border border-[color:var(--border)] hover:bg-white/5";
  const cls = base + " " + (variant==="solid"?solid:ghost) + " " + className;
  if(href) return <Link className={cls} href={href}>{children}</Link>;
  return <button className={cls} onClick={onClick}>{children}</button>;
}
