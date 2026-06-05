import type { Activity } from "./types";

/** Short phrase for "I'll … with you!" from activity title/description. */
export function activityCompanionLine(activity: Activity | { title: string; description: string }): string {
  const text = `${activity.title} ${activity.description}`.toLowerCase();
  if (text.includes("walk") || text.includes("outdoor")) return "I'll take a little walk with you!";
  if (text.includes("jump") || text.includes("cardio")) return "I'll move with you!";
  if (text.includes("breath") || text.includes("meditat")) return "I'll breathe with you!";
  if (text.includes("water") || text.includes("drink")) return "I'll sip water with you!";
  if (text.includes("read") || text.includes("journal")) return "I'll read quietly with you!";
  if (text.includes("stretch") || text.includes("yoga")) return "I'll stretch with you!";
  if (text.includes("rest") || text.includes("nap")) return "I'll rest with you!";
  return `I'll try "${activity.title}" with you!`;
}

export function indoorOutdoorHint(activity: Activity): string {
  if (activity.indoor && activity.outdoor) return "Indoor or outdoor";
  if (activity.outdoor) return "Best outdoors";
  return "Indoor-friendly";
}
