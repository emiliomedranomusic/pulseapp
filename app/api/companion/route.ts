import { NextResponse } from "next/server";

/**
 * TODO: stretch — dynamic creature dialogue via LLM.
 * When OPENAI_API_KEY (or similar) is set, generate a short warm line.
 * Until then, clients use lib/dialogue.ts static fallback.
 */
export async function POST() {
  return NextResponse.json({
    line: null,
    source: "static",
    message: "LLM companion not configured — use lib/dialogue.ts fallback",
  });
}
