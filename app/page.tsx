"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { OnboardingPage } from "@/components/OnboardingPage";

export default function HomePage() {
  const router = useRouter();

  return (
    <AppShell hideNavLinks>
      {({ profile }) => {
        if (profile.name?.trim()) {
          return <RedirectToToday router={router} />;
        }
        return <OnboardingPage profile={profile} />;
      }}
    </AppShell>
  );
}

function RedirectToToday({ router }: { router: ReturnType<typeof useRouter> }) {
  useEffect(() => {
    router.replace("/today");
  }, [router]);
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <p className="text-on-surface-variant">Taking you to Today…</p>
    </main>
  );
}
