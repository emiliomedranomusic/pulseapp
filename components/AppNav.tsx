"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/today", label: "Today" },
  { href: "/community", label: "Community" },
  { href: "/journal", label: "Journal" },
  { href: "/profile", label: "Profile" },
] as const;

interface AppNavProps {
  profile: Profile | null;
  streak?: number;
  hideLinks?: boolean;
}

export function AppNav({ profile, streak, hideLinks }: AppNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md soft-shadow">
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-margin-mobile py-3 md:h-20 md:px-margin-desktop">
        <Link href={profile?.name ? "/today" : "/"} className="font-headline-md text-headline-md text-primary tracking-tight">
          Pulse
        </Link>

        {!hideLinks && profile?.name ? (
          <nav className="hidden items-center gap-6 md:flex md:gap-8">
            {NAV.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`pb-1 font-medium transition-colors ${
                    active
                      ? "border-b-2 border-primary font-bold text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="flex items-center gap-3 md:gap-4">
          {profile ? (
            <>
              <span className="text-primary" title="Streak" aria-hidden>
                🔥
              </span>
              <span className="hidden text-label-md text-on-surface-variant sm:inline">
                {streak ?? profile.streak}
              </span>
              <div
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-secondary-container text-lg"
                aria-hidden
              >
                {(profile.name ?? "?")[0]?.toUpperCase()}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {!hideLinks && profile?.name ? (
        <nav className="flex justify-center gap-4 border-t border-surface-container-high/50 px-margin-mobile py-2 md:hidden">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`text-label-md ${active ? "font-bold text-primary" : "text-on-surface-variant"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
