/**
 * Companion dialogue lines. Static fallback always available.
 * TODO: stretch — call /api/companion with LLM when OPENAI_API_KEY (or similar) is set.
 */
export function getCompanionLine(context: "greeting" | "farewell", name?: string): string {
  if (context === "farewell") {
    const who = name?.trim() ? name.trim() : "friend";
    return `Thanks for today, ${who} — see you tomorrow 💛`;
  }
  return "Hey there — ready for a tiny wellness moment together?";
}
