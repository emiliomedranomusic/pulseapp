"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOffset, setOffset, today } from "@/lib/today";

interface DemoContextValue {
  offsetDays: number;
  todayStr: string;
  refreshKey: number;
  nextDay: () => void;
  prevDay: () => void;
  setDay: (n: number) => void;
  triggerRefresh: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [offsetDays, setOffsetDays] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setOffsetDays(getOffset());
  }, []);

  const applyOffset = useCallback((n: number) => {
    setOffsetDays(n);
    setOffset(n);
    setRefreshKey((k) => k + 1);
  }, []);

  const value = useMemo((): DemoContextValue => {
    const todayStr = today(offsetDays);
    return {
      offsetDays,
      todayStr,
      refreshKey,
      nextDay: () => applyOffset(offsetDays + 1),
      prevDay: () => applyOffset(offsetDays - 1),
      setDay: applyOffset,
      triggerRefresh: () => setRefreshKey((k) => k + 1),
    };
  }, [offsetDays, refreshKey, applyOffset]);

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}

export function useToday(): string {
  return useDemo().todayStr;
}
