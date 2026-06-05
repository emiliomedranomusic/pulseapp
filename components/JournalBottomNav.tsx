"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

const ITEMS: {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}[] = [
  { href: "/today", label: "Home", icon: "home" },
  { href: "/today?step=mood", label: "Mood", icon: "face" },
  { href: "/journal", label: "Log", icon: "edit_note", active: true },
  { href: "/profile", label: "Profile", icon: "person" },
];

export function JournalBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-lg bg-surface px-4 pb-8 pt-4 shadow-[0_-10px_40px_0_rgba(100,85,145,0.08)] md:hidden">
      {ITEMS.map(({ href, label, icon, active }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
            active
              ? "rounded-full bg-secondary-container px-6 py-2 text-on-secondary-container shadow-md"
              : "p-2 text-secondary hover:bg-secondary-fixed-dim/20"
          }`}
        >
          <MaterialIcon name={icon} className="text-2xl" filled={active} />
          <span className="mt-1 font-label-lg text-label-lg">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
