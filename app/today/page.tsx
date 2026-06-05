"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/components/DemoProvider";
import { AppShell } from "@/components/AppShell";
import { HomeScreen } from "@/components/HomeScreen";
import { getTodayCheckin } from "@/lib/db";
import type { Checkin, Profile } from "@/lib/types";

export default function TodayPage() {
  const router = useRouter();

  return (
    <AppShell>
      {({ profile, refetch }) => {
        if (!profile.name?.trim()) {
          return <RedirectHome router={router} />;
        }
        return <TodayContent profile={profile} onProfileUpdate={refetch} />;
      }}
    </AppShell>
  );
}

function RedirectHome({ router }: { router: ReturnType<typeof useRouter> }) {
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}

function TodayContent({
  profile,
  onProfileUpdate,
}: {
  profile: Profile;
  onProfileUpdate: () => Promise<void>;
}) {
  const [checkin, setCheckin] = useState<Checkin | null>(null);
  const { todayStr, refreshKey } = useDemo();

  const loadCheckin = useCallback(async () => {
    const c = await getTodayCheckin(profile.id);
    setCheckin(c);
    await onProfileUpdate();
  }, [profile.id, onProfileUpdate]);

  useEffect(() => {
    void loadCheckin();
  }, [loadCheckin, todayStr, refreshKey]);

  return <HomeScreen profile={profile} checkin={checkin} onUpdate={loadCheckin} />;
}
