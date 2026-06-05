/** Local cover art for seeded community events (works even before DB migration). */
export const COMMUNITY_EVENT_IMAGES: Record<string, string> = {
  "Morning Co-working & Matcha": "/community/morning-coworking-matcha.png",
  "Silent Meditation Circle": "/community/silent-meditation.png",
  "Digital Nomad Coffee Hour": "/community/digital-nomad-coffee.png",
  "Creative Flow Workshop": "/community/creative-flow-workshop.png",
  "Sunset Beach Walk & Breathe": "/community/sunset-beach-walk.png",
  "Gentle Yoga in the Park": "/community/gentle-yoga-park.png",
  "Gratitude Journaling Meetup": "/community/gratitude-journaling.png",
  "Neighborhood Sketch & Sip": "/community/neighborhood-sketch-sip.png",
};

export function resolveCommunityEventImage(
  title: string,
  imageUrl: string | null
): string | null {
  return COMMUNITY_EVENT_IMAGES[title] ?? imageUrl;
}
