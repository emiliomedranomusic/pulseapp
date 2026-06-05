"use client";

import { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { formatAuthError } from "@/lib/auth-errors";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

interface AuthContextValue {
  session: Session | null;
  ready: boolean;
  error: string | null;
  errorCode: string | null;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setReady(false);
    setError(null);
    setErrorCode(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart npm run dev."
      );
      setReady(true);
      return;
    }

    let cancelled = false;
    const supabase = getSupabase();

    async function init() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("[Pulse auth] getSession failed:", sessionError);
        }

        let active = sessionData.session;

        if (!active) {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInAnonymously();

          if (signInError) {
            console.error("[Pulse auth] signInAnonymously failed:", {
              message: signInError.message,
              code: signInError.code,
              status: signInError.status,
              name: signInError.name,
            });
            throw signInError;
          }

          active = signInData.session;
          console.info("[Pulse auth] Anonymous session created:", {
            userId: signInData.user?.id,
            isAnonymous: signInData.user?.is_anonymous,
          });
        } else {
          console.info("[Pulse auth] Reusing existing session:", {
            userId: active.user.id,
            isAnonymous: active.user.is_anonymous,
          });
        }

        if (!cancelled) {
          setSession(active);
          setError(null);
          setErrorCode(null);
        }
      } catch (e) {
        if (!cancelled) {
          const formatted = formatAuthError(e, SUPABASE_URL);
          setError(formatted.message);
          setErrorCode(formatted.code);
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      console.info("[Pulse auth] onAuthStateChange:", event);
      setSession(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [attempt]);

  const value = useMemo(
    () => ({ session, ready, error, errorCode, retry }),
    [session, ready, error, errorCode, retry]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
