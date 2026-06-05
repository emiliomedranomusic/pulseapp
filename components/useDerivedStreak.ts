"use client";

import { useEffect, useState } from "react";
import { useDemo } from "@/components/DemoProvider";
import { getCompletedCheckinDates } from "@/lib/db";
import { computeStreak } from "@/lib/streak";

export function useDerivedStreak(profileId: string | undefined) {
  const { todayStr, refreshKey } = useDemo();
  const [streak, setStreak] = useState(0);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      setStreak(0);
      setDates([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void getCompletedCheckinDates(profileId).then((d) => {
      if (cancelled) return;
      setDates(d);
      setStreak(computeStreak(d, todayStr));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [profileId, todayStr, refreshKey]);

  return { streak, dates, todayStr, loading };
}
