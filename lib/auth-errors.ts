import { AuthError } from "@supabase/supabase-js";
import { anonymousSignInHelpMessage, getSupabaseProjectRef } from "./supabase-config";

export function formatAuthError(
  error: unknown,
  supabaseUrl?: string
): { message: string; code: string | null; status: number | null } {
  if (error instanceof AuthError) {
    const projectRef = supabaseUrl ? getSupabaseProjectRef(supabaseUrl) : null;
    if (error.code === "anonymous_provider_disabled") {
      return {
        message: anonymousSignInHelpMessage(projectRef),
        code: error.code,
        status: error.status ?? null,
      };
    }
    return {
      message: error.message,
      code: error.code ?? null,
      status: error.status ?? null,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, code: null, status: null };
  }

  return { message: "Could not sign in", code: null, status: null };
}
