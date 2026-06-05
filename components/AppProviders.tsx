"use client";

import { AuthProvider } from "@/components/AuthProvider";
import { DemoPanel } from "@/components/DemoPanel";
import { DemoProvider } from "@/components/DemoProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DemoProvider>
        {children}
        <DemoPanel />
      </DemoProvider>
    </AuthProvider>
  );
}
