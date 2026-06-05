#!/usr/bin/env python3
"""Generate supabase/seed.sql for wellness activities and mood tags."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CATEGORIES = [
    ("breath_calm", "Breath & calm", "Breathing exercises and calming breath rituals", 1),
    ("meditation_mindfulness", "Meditation & mindfulness", "Grounding, meditation, and present-moment practices", 2),
    ("gentle_movement", "Gentle movement & stretch", "Low-intensity stretches and mobility", 3),
    ("walk_outdoors", "Walk & outdoors", "Outdoor and walking-based wellness", 4),
    ("cardio_kinetic", "Cardio & kinetic", "Higher-energy movement and cardio", 5),
    ("strength_mobility", "Strength & mobility", "Strength, resistance, and mobility work", 6),
    ("creative_expressive", "Creative & expressive", "Creative outlets and self-expression", 7),
    ("connection_care", "Connection & care", "Social connection and self-compassion", 8),
    ("rest_sensory", "Rest, sensory & routine", "Rest, sensory soothing, and routine rituals", 9),
]

MOODS = [
    ("low_tired", "Low / tired", "Drained, sleepy, or low energy", 1),
    ("anxious", "Anxious / tense", "Worried, on edge, or physically tight", 2),
    ("neutral", "Okay / neutral", "Steady or in-between", 3),
    ("good_content", "Good / content", "Relaxed, settled, or at ease", 4),
    ("awesome", "Awesome!", "Energized, joyful, or on top of the world", 5),
]

MOOD_SLUGS = {m[0] for m in MOODS}
SUITABILITY_RANK = {"recommended": 2, "suitable": 1, "avoid": 0}


def remap_mood_slug(old_slug: str, energy: str) -> str:
    """Map legacy mood slugs onto the five-mood check-in scale."""
    if old_slug in MOOD_SLUGS:
        return old_slug
    if old_slug == "angry_tense":
        return "anxious"
    if old_slug == "restless":
        if energy == "high":
            return "awesome"
        if energy == "medium":
            return "good_content"
        return "neutral"
    if old_slug == "good_energetic":
        return "awesome" if energy == "high" else "good_content"
    raise ValueError(f"Unknown mood slug: {old_slug}")


def normalize_mood_tags(
    moods: list[tuple[str, str, int]], energy: str
) -> list[tuple[str, str, int]]:
    """Remap, dedupe, and drop tags that clash with activity energy."""
    merged: dict[str, tuple[str, str, int]] = {}
    for slug, suitability, weight in moods:
        new_slug = remap_mood_slug(slug, energy)
        if new_slug == "awesome" and energy == "low":
            new_slug = "good_content"
            weight = min(weight, 8)
        if new_slug == "low_tired" and energy == "high":
            continue
        if new_slug in merged:
            _, existing_suit, existing_w = merged[new_slug]
            best_suit = (
                suitability
                if SUITABILITY_RANK[suitability] > SUITABILITY_RANK[existing_suit]
                else existing_suit
            )
            merged[new_slug] = (new_slug, best_suit, max(weight, existing_w))
        else:
            merged[new_slug] = (new_slug, suitability, weight)
    return list(merged.values())

# (slug, title, description, category, dur_min, dur_max, energy, indoor, outdoor, moods)
# moods: list of (mood_slug, suitability, weight)
ACTIVITIES: list[tuple] = [
    ("box-breathing", "Box breathing", "4 counts in, hold, out, hold.", "breath_calm", 3, 5, "low", True, False, [
        ("low_tired", "recommended", 10), ("anxious", "recommended", 10), ("angry_tense", "suitable", 7),
    ]),
    ("four-seven-eight-breath", "4-7-8 breath", "Inhale 4, hold 7, exhale 8.", "breath_calm", 3, 5, "low", True, False, [
        ("low_tired", "recommended", 9), ("anxious", "recommended", 10),
    ]),
    ("belly-breathing", "Belly breathing", "Hand on stomach, slow deep breaths.", "breath_calm", 3, 5, "low", True, False, [
        ("low_tired", "recommended", 10), ("anxious", "recommended", 9), ("angry_tense", "suitable", 6),
    ]),
    ("physiological-sigh", "Physiological sigh", "Double inhale through nose, long exhale through mouth.", "breath_calm", 2, 3, "low", True, False, [
        ("anxious", "recommended", 10), ("angry_tense", "recommended", 9),
    ]),
    ("humming-breath", "Humming breath", "Hum on the exhale for 1 minute.", "breath_calm", 2, 3, "low", True, False, [
        ("low_tired", "suitable", 7), ("anxious", "recommended", 8),
    ]),
    ("alternate-nostril-breathing", "Alternate nostril breathing", "Gentle nasal breathing pattern.", "breath_calm", 3, 5, "low", True, False, [
        ("anxious", "recommended", 9), ("neutral", "suitable", 6),
    ]),
    ("counted-breaths", "Counted breaths", "Count 10 slow breaths with eyes closed.", "breath_calm", 2, 4, "low", True, False, [
        ("low_tired", "recommended", 9), ("anxious", "recommended", 8), ("neutral", "suitable", 7),
    ]),
    ("cool-down-breath", "Cool-down breath", "Sip air through pursed lips, long exhale.", "breath_calm", 2, 3, "low", True, False, [
        ("anxious", "recommended", 9), ("angry_tense", "suitable", 7),
    ]),
    ("morning-breath-ritual", "Morning breath ritual", "Three intentional breaths before getting up.", "breath_calm", 1, 2, "low", True, False, [
        ("low_tired", "recommended", 8), ("neutral", "suitable", 7), ("good_energetic", "suitable", 6),
    ]),
    ("evening-wind-down-breath", "Evening wind-down breath", "Five slow breaths in bed or on the couch.", "breath_calm", 2, 3, "low", True, False, [
        ("low_tired", "recommended", 10), ("anxious", "suitable", 7),
    ]),
    ("lions-breath", "Lion's breath", "Inhale, open mouth, stick out tongue, exhale with a ha.", "breath_calm", 2, 3, "low", True, False, [
        ("angry_tense", "recommended", 10), ("restless", "suitable", 7),
    ]),
    ("breath-with-phrase", "Breath with a phrase", "In: I am here. Out: I let go.", "breath_calm", 3, 5, "low", True, False, [
        ("anxious", "recommended", 9), ("low_tired", "suitable", 8),
    ]),
    ("paced-walking-breath", "Paced walking breath", "Match steps to inhale/exhale for 2 minutes.", "breath_calm", 2, 5, "low", True, True, [
        ("anxious", "suitable", 8), ("restless", "recommended", 9), ("neutral", "suitable", 7),
    ]),
    ("cool-cloth-breath", "Cool cloth + breath", "Cool water on wrists/face, then slow breathing.", "breath_calm", 3, 5, "low", True, False, [
        ("low_tired", "recommended", 9), ("anxious", "recommended", 8), ("angry_tense", "suitable", 7),
    ]),
    ("sound-bath-at-home", "Sound bath at home", "One calming track, eyes closed, just listening.", "breath_calm", 5, 15, "low", True, False, [
        ("low_tired", "recommended", 9), ("anxious", "recommended", 8), ("neutral", "suitable", 6),
    ]),
    ("body-scan", "Body scan", "Notice feet to head, no fixing.", "meditation_mindfulness", 5, 15, "low", True, False, [
        ("low_tired", "recommended", 10), ("anxious", "recommended", 9), ("angry_tense", "suitable", 7),
    ]),
    ("five-four-three-two-one", "5-4-3-2-1 grounding", "See, touch, hear, smell, taste (or skip taste).", "meditation_mindfulness", 3, 5, "low", True, True, [
        ("anxious", "recommended", 10), ("restless", "suitable", 7),
    ]),
    ("loving-kindness", "Loving-kindness", "Wish yourself and someone else well.", "meditation_mindfulness", 5, 10, "low", True, False, [
        ("anxious", "recommended", 9), ("low_tired", "suitable", 8), ("angry_tense", "suitable", 7),
    ]),
    ("one-minute-stillness", "One-minute stillness", "Sit quietly, no goal.", "meditation_mindfulness", 1, 2, "low", True, False, [
        ("low_tired", "recommended", 8), ("neutral", "suitable", 7),
    ]),
    ("mindful-tea-or-water", "Mindful tea or water", "Sip slowly, notice temperature and taste.", "meditation_mindfulness", 3, 5, "low", True, False, [
        ("low_tired", "recommended", 9), ("neutral", "suitable", 8), ("anxious", "suitable", 7),
    ]),
    ("mindful-snack", "Mindful snack", "Eat one thing without screens.", "meditation_mindfulness", 3, 10, "low", True, False, [
        ("low_tired", "suitable", 7), ("neutral", "recommended", 8),
    ]),
    ("label-thoughts", "Label thoughts", "Planning, worrying — then return to breath.", "meditation_mindfulness", 3, 5, "low", True, False, [
        ("anxious", "recommended", 10), ("restless", "suitable", 6),
    ]),
    ("open-awareness", "Open awareness", "Let sounds and sensations come and go.", "meditation_mindfulness", 5, 10, "low", True, False, [
        ("anxious", "suitable", 8), ("neutral", "suitable", 7),
    ]),
    ("gratitude-pause", "Gratitude pause", "Name three specific small things.", "meditation_mindfulness", 2, 5, "low", True, False, [
        ("low_tired", "recommended", 10), ("neutral", "recommended", 8), ("good_energetic", "suitable", 7),
    ]),
    ("future-self-note", "Future-self note", "One kind sentence to tomorrow's you.", "meditation_mindfulness", 2, 5, "low", True, False, [
        ("low_tired", "recommended", 9), ("anxious", "suitable", 7),
    ]),
    ("mindful-hand-wash", "Mindful hand wash", "Feel water, soap, temperature for 60 seconds.", "meditation_mindfulness", 1, 2, "low", True, False, [
        ("anxious", "suitable", 7), ("neutral", "suitable", 6),
    ]),
    ("cloud-sky-watch", "Cloud or sky watch", "Look up for a few minutes.", "meditation_mindfulness", 3, 10, "low", False, True, [
        ("anxious", "recommended", 9), ("restless", "suitable", 7), ("neutral", "suitable", 7),
    ]),
    ("candle-light-focus", "Candle or light focus", "Soft gaze on one point.", "meditation_mindfulness", 3, 10, "low", True, False, [
        ("anxious", "recommended", 8), ("low_tired", "suitable", 7),
    ]),
    ("walking-meditation", "Walking meditation", "Slow steps, feel feet on ground.", "meditation_mindfulness", 5, 15, "low", True, True, [
        ("anxious", "recommended", 10), ("restless", "recommended", 8), ("neutral", "suitable", 7),
    ]),
    ("bedtime-body-check", "Bedtime body check", "Where am I holding tension? Soften one spot.", "meditation_mindfulness", 3, 8, "low", True, False, [
        ("low_tired", "recommended", 10), ("angry_tense", "suitable", 8),
    ]),
    ("neck-rolls", "Neck rolls", "Slow circles, both directions.", "gentle_movement", 2, 5, "low", True, False, [
        ("angry_tense", "recommended", 9), ("low_tired", "suitable", 7), ("restless", "suitable", 6),
    ]),
    ("shoulder-shrugs", "Shoulder shrugs", "Up, hold, release x10.", "gentle_movement", 2, 3, "low", True, False, [
        ("angry_tense", "recommended", 9), ("anxious", "suitable", 7),
    ]),
    ("cat-cow-stretch", "Cat-cow stretch", "On hands and knees or seated version.", "gentle_movement", 3, 5, "low", True, False, [
        ("angry_tense", "recommended", 10), ("low_tired", "suitable", 7), ("restless", "suitable", 6),
    ]),
    ("childs-pose", "Child's pose", "1-3 minutes, breathe into back.", "gentle_movement", 3, 5, "low", True, False, [
        ("low_tired", "recommended", 9), ("anxious", "recommended", 8), ("angry_tense", "suitable", 7),
    ]),
    ("standing-forward-fold", "Standing forward fold", "Soft hang, bent knees OK.", "gentle_movement", 2, 5, "low", True, False, [
        ("angry_tense", "recommended", 9), ("restless", "suitable", 6),
    ]),
    ("hip-circles", "Hip circles", "Standing or lying, loosen hips.", "gentle_movement", 2, 4, "low", True, False, [
        ("restless", "suitable", 7), ("angry_tense", "suitable", 7),
    ]),
    ("wrist-finger-stretches", "Wrist and finger stretches", "Good after typing.", "gentle_movement", 2, 4, "low", True, False, [
        ("neutral", "suitable", 7), ("angry_tense", "suitable", 6),
    ]),
    ("ankle-rolls", "Ankle rolls", "Both feet, seated or standing.", "gentle_movement", 2, 3, "low", True, False, [
        ("low_tired", "suitable", 6), ("restless", "suitable", 6),
    ]),
    ("gentle-twist", "Gentle twist", "Seated or lying, both sides.", "gentle_movement", 3, 5, "low", True, False, [
        ("angry_tense", "recommended", 8), ("low_tired", "suitable", 7),
    ]),
    ("wall-stretch", "Wall stretch", "Calves or chest against a wall.", "gentle_movement", 3, 5, "low", True, False, [
        ("angry_tense", "suitable", 7), ("restless", "suitable", 6),
    ]),
    ("desk-yoga", "Desk yoga", "Five poses at your chair.", "gentle_movement", 5, 10, "low", True, False, [
        ("neutral", "recommended", 8), ("low_tired", "suitable", 7), ("angry_tense", "suitable", 7),
    ]),
    ("sun-salutation-short", "Sun salutation (short)", "Three rounds, easy pace.", "gentle_movement", 5, 10, "medium", True, False, [
        ("good_energetic", "recommended", 9), ("neutral", "suitable", 7), ("restless", "suitable", 8),
    ]),
    ("balance-practice", "Balance practice", "One leg, 30 seconds each side.", "gentle_movement", 3, 5, "medium", True, True, [
        ("good_energetic", "suitable", 7), ("neutral", "suitable", 7), ("restless", "suitable", 7),
    ]),
    ("foam-roll", "Foam roll or tennis ball", "Calves, upper back, or glutes.", "gentle_movement", 5, 10, "medium", True, False, [
        ("angry_tense", "recommended", 9), ("good_energetic", "suitable", 7),
    ]),
    ("progressive-muscle-relaxation", "Progressive muscle relaxation", "Tense and release each muscle group.", "gentle_movement", 5, 15, "low", True, False, [
        ("low_tired", "recommended", 10), ("anxious", "recommended", 10), ("angry_tense", "recommended", 8),
    ]),
    ("neighborhood-walk", "10-minute neighborhood walk", "No destination.", "walk_outdoors", 10, 15, "medium", False, True, [
        ("neutral", "recommended", 9), ("restless", "recommended", 9), ("low_tired", "suitable", 6),
    ]),
    ("park-bench-sit", "Park bench sit", "Outside, no phone for 5 minutes.", "walk_outdoors", 5, 10, "low", False, True, [
        ("low_tired", "suitable", 8), ("anxious", "suitable", 7), ("neutral", "recommended", 8),
    ]),
    ("tree-plant-notice-walk", "Tree or plant notice walk", "Name five greens you see.", "walk_outdoors", 5, 15, "low", False, True, [
        ("anxious", "suitable", 8), ("neutral", "recommended", 8), ("restless", "suitable", 7),
    ]),
    ("sunlight-break", "Sunlight break", "Face the sun safely for 2 minutes.", "walk_outdoors", 2, 5, "low", False, True, [
        ("low_tired", "recommended", 9), ("neutral", "suitable", 7),
    ]),
    ("fresh-air-at-door", "Fresh air at the door", "Step outside, three deep breaths.", "walk_outdoors", 1, 3, "low", False, True, [
        ("anxious", "recommended", 10), ("low_tired", "suitable", 8), ("restless", "suitable", 7),
    ]),
    ("barefoot-grass", "Barefoot grass", "Two minutes on grass or earth if safe.", "walk_outdoors", 2, 5, "low", False, True, [
        ("anxious", "suitable", 8), ("neutral", "suitable", 7), ("good_energetic", "suitable", 6),
    ]),
    ("bird-nature-listen", "Bird or nature listen", "Stand still, count sounds.", "walk_outdoors", 3, 10, "low", False, True, [
        ("anxious", "recommended", 8), ("restless", "suitable", 7),
    ]),
    ("photo-walk", "Photo walk", "One photo of something beautiful, then put phone away.", "walk_outdoors", 10, 20, "medium", False, True, [
        ("neutral", "recommended", 8), ("good_energetic", "suitable", 7), ("restless", "suitable", 7),
    ]),
    ("stairs-climb-light", "Stairs climb", "One flight up and down, own pace.", "walk_outdoors", 3, 5, "medium", True, True, [
        ("restless", "recommended", 9), ("good_energetic", "suitable", 8),
    ]),
    ("walk-and-call", "Walk and call", "Walk while talking to someone you like.", "walk_outdoors", 10, 20, "medium", False, True, [
        ("neutral", "recommended", 8), ("good_energetic", "suitable", 7), ("restless", "suitable", 7),
    ]),
    ("litter-pick-mini", "Litter pick mini", "One small bag on a short route.", "walk_outdoors", 10, 15, "medium", False, True, [
        ("good_energetic", "suitable", 8), ("neutral", "recommended", 7),
    ]),
    ("garden-balcony-tending", "Garden or balcony tending", "Water, weed, or touch soil.", "walk_outdoors", 10, 20, "low", False, True, [
        ("neutral", "recommended", 8), ("low_tired", "suitable", 7), ("good_energetic", "suitable", 6),
    ]),
    ("evening-stroll", "Evening stroll", "Low light, calm pace before bed.", "walk_outdoors", 10, 20, "low", False, True, [
        ("low_tired", "suitable", 8), ("neutral", "recommended", 8), ("anxious", "suitable", 7),
    ]),
    ("brisk-walk", "Brisk 15-minute walk", "Slightly faster than usual.", "cardio_kinetic", 15, 20, "medium", False, True, [
        ("good_energetic", "recommended", 10), ("neutral", "recommended", 9), ("restless", "recommended", 9),
    ]),
    ("dance-break", "Dance break", "One song, full body.", "cardio_kinetic", 3, 5, "high", True, False, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 10), ("angry_tense", "suitable", 7),
    ]),
    ("jumping-jacks", "Jumping jacks", "30 seconds on, 30 off, repeat 3x.", "cardio_kinetic", 3, 5, "high", True, True, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 10),
    ]),
    ("jump-rope", "Jump rope", "2-5 minutes or imaginary rope.", "cardio_kinetic", 2, 5, "high", True, True, [
        ("good_energetic", "recommended", 9), ("restless", "recommended", 9),
    ]),
    ("stair-intervals", "Stair intervals", "Up fast, down slow, 5 rounds.", "cardio_kinetic", 5, 10, "high", True, True, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 9),
    ]),
    ("bike-ride", "Bike ride", "Short loop around the block.", "cardio_kinetic", 15, 30, "high", False, True, [
        ("good_energetic", "recommended", 10), ("neutral", "suitable", 7),
    ]),
    ("swim-or-pool-dip", "Swim or pool dip", "Laps or float if you have access.", "cardio_kinetic", 15, 30, "high", False, True, [
        ("good_energetic", "recommended", 10), ("angry_tense", "suitable", 7),
    ]),
    ("gym-session-short", "Gym session (short)", "20 minutes: warm-up + one focus area.", "cardio_kinetic", 20, 30, "high", True, True, [
        ("good_energetic", "recommended", 10), ("neutral", "suitable", 6),
    ]),
    ("bodyweight-circuit", "Bodyweight circuit", "Squats, push-ups, plank — 2 rounds.", "cardio_kinetic", 10, 15, "high", True, True, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 8),
    ]),
    ("shadow-boxing", "Shadow boxing", "3 minutes, light punches, breathe.", "cardio_kinetic", 3, 5, "high", True, False, [
        ("angry_tense", "recommended", 10), ("restless", "recommended", 9), ("good_energetic", "suitable", 8),
    ]),
    ("micro-hike", "Hike (micro)", "Trail or hill, 20-30 minutes.", "cardio_kinetic", 20, 30, "high", False, True, [
        ("good_energetic", "recommended", 10), ("neutral", "suitable", 7),
    ]),
    ("run-or-jog", "Run or jog", "Easy pace, run-walk OK.", "cardio_kinetic", 15, 30, "high", False, True, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 9),
    ]),
    ("sports-play", "Sports play", "Shoot hoops, kick ball, frisbee — play, not performance.", "cardio_kinetic", 15, 30, "high", False, True, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 9), ("neutral", "suitable", 7),
    ]),
    ("active-chores-burst", "Active chores burst", "Vacuum, mop, or yard work with energy.", "cardio_kinetic", 10, 20, "medium", True, True, [
        ("good_energetic", "suitable", 8), ("restless", "recommended", 8), ("neutral", "suitable", 7),
    ]),
    ("plank-hold", "Plank hold", "20-40 seconds, 3 sets.", "strength_mobility", 3, 5, "medium", True, False, [
        ("good_energetic", "recommended", 9), ("neutral", "suitable", 6),
    ]),
    ("glute-bridges", "Glute bridges", "12 reps, 2 sets.", "strength_mobility", 5, 8, "medium", True, False, [
        ("good_energetic", "recommended", 8), ("neutral", "suitable", 7),
    ]),
    ("resistance-band-row", "Resistance band row", "Or towel row at home.", "strength_mobility", 5, 10, "medium", True, False, [
        ("good_energetic", "recommended", 8), ("neutral", "suitable", 6),
    ]),
    ("wall-sit", "Wall sit", "30-45 seconds.", "strength_mobility", 2, 4, "medium", True, False, [
        ("good_energetic", "recommended", 8), ("restless", "suitable", 7),
    ]),
    ("farmer-walk", "Carry something heavy safely", "Groceries, water jugs — farmer's walk.", "strength_mobility", 3, 5, "medium", True, True, [
        ("good_energetic", "suitable", 8), ("neutral", "suitable", 6),
    ]),
    ("mobility-flow", "Mobility flow", "Hips, thoracic spine, ankles — 8 minutes.", "strength_mobility", 8, 12, "medium", True, False, [
        ("good_energetic", "recommended", 9), ("angry_tense", "suitable", 8), ("restless", "suitable", 7),
    ]),
    ("core-trio", "Core trio", "Dead bug, bird dog, side plank (modified OK).", "strength_mobility", 8, 12, "medium", True, False, [
        ("good_energetic", "recommended", 9), ("neutral", "suitable", 6),
    ]),
    ("stretch-after-effort", "Stretch after effort", "5 minutes post any movement.", "strength_mobility", 5, 8, "low", True, False, [
        ("good_energetic", "recommended", 8), ("angry_tense", "recommended", 8), ("restless", "suitable", 6),
    ]),
    ("free-write", "Free write", "5 minutes, no editing.", "creative_expressive", 5, 10, "low", True, False, [
        ("angry_tense", "recommended", 9), ("anxious", "suitable", 8), ("neutral", "recommended", 8),
    ]),
    ("doodle-sketch", "Doodle or sketch", "Pen and paper, no judgment.", "creative_expressive", 5, 15, "low", True, False, [
        ("neutral", "recommended", 8), ("anxious", "suitable", 7), ("restless", "suitable", 7),
    ]),
    ("hum-or-sing", "Hum or sing", "One song, alone or with music.", "creative_expressive", 3, 5, "low", True, False, [
        ("good_energetic", "suitable", 8), ("low_tired", "suitable", 7), ("neutral", "suitable", 7),
    ]),
    ("play-instrument", "Play an instrument", "Even 5 minutes of scales or one tune.", "creative_expressive", 5, 15, "medium", True, False, [
        ("good_energetic", "suitable", 8), ("neutral", "recommended", 7),
    ]),
    ("collage-or-color", "Collage or color", "Magazine scraps or coloring page.", "creative_expressive", 10, 20, "low", True, False, [
        ("anxious", "suitable", 8), ("neutral", "recommended", 8), ("restless", "suitable", 6),
    ]),
    ("voice-memo-feelings", "Voice memo feelings", "Talk for 60 seconds; skip replay if that helps.", "creative_expressive", 1, 3, "low", True, False, [
        ("angry_tense", "recommended", 9), ("anxious", "suitable", 8),
    ]),
    ("craft-micro-project", "Craft micro-project", "Fold paper, knit one row, LEGO for 10 minutes.", "creative_expressive", 10, 15, "low", True, False, [
        ("neutral", "recommended", 8), ("restless", "suitable", 7),
    ]),
    ("silly-dance", "Dance like nobody's watching", "Silly version — creature joins.", "creative_expressive", 3, 5, "medium", True, False, [
        ("good_energetic", "recommended", 10), ("restless", "recommended", 10), ("angry_tense", "suitable", 7),
    ]),
    ("text-someone-kind", "Text someone kind", "One genuine message.", "connection_care", 2, 5, "low", True, False, [
        ("neutral", "recommended", 9), ("low_tired", "suitable", 7), ("good_energetic", "suitable", 7),
    ]),
    ("thank-you-note", "Thank-you note", "Digital or paper, two sentences.", "connection_care", 3, 5, "low", True, False, [
        ("neutral", "recommended", 8), ("good_energetic", "suitable", 7),
    ]),
    ("call-friend-family", "Call a friend or family", "5-minute check-in.", "connection_care", 5, 10, "low", True, False, [
        ("neutral", "recommended", 9), ("low_tired", "suitable", 7),
    ]),
    ("pet-an-animal", "Pet an animal", "Yours or visit a friend's pet mindfully.", "connection_care", 5, 10, "low", True, False, [
        ("anxious", "recommended", 9), ("low_tired", "recommended", 8), ("neutral", "suitable", 7),
    ]),
    ("self-compassion-phrase", "Self-compassion phrase", "Say aloud: This is hard; I'm doing my best.", "connection_care", 1, 2, "low", True, False, [
        ("angry_tense", "recommended", 10), ("low_tired", "recommended", 9), ("anxious", "suitable", 8),
    ]),
    ("boundary-micro-act", "Boundary micro-act", "Mute one channel, delay one reply, say no to one thing.", "connection_care", 2, 5, "low", True, False, [
        ("anxious", "recommended", 9), ("angry_tense", "suitable", 8),
    ]),
    ("act-of-kindness", "Act of kindness", "Hold a door, compliment, small help.", "connection_care", 2, 10, "low", True, True, [
        ("good_energetic", "suitable", 8), ("neutral", "recommended", 8),
    ]),
    ("power-nap", "Power nap", "10-20 minutes, timer on.", "rest_sensory", 10, 20, "low", True, False, [
        ("low_tired", "recommended", 10),
    ]),
    ("legs-up-wall", "Legs up the wall", "5-10 minutes, calm nervous system.", "rest_sensory", 5, 10, "low", True, False, [
        ("low_tired", "recommended", 10), ("anxious", "recommended", 9),
    ]),
    ("warm-shower-bath", "Warm shower or bath", "Focus on warmth and water sound.", "rest_sensory", 10, 20, "low", True, False, [
        ("low_tired", "recommended", 10), ("angry_tense", "suitable", 8), ("anxious", "suitable", 7),
    ]),
    ("tidy-one-surface", "Tidy one surface", "Clear desk or nightstand for mental space.", "rest_sensory", 5, 10, "low", True, False, [
        ("low_tired", "recommended", 9), ("neutral", "suitable", 7), ("restless", "suitable", 6),
    ]),
    ("sleep-prep-ritual", "Sleep prep ritual", "Dim lights, no screens 15 minutes, same small sequence nightly.", "rest_sensory", 15, 20, "low", True, False, [
        ("low_tired", "recommended", 10), ("neutral", "recommended", 8), ("anxious", "suitable", 7),
    ]),
]


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def main() -> None:
    assert len(ACTIVITIES) == 100, f"Expected 100 activities, got {len(ACTIVITIES)}"

    lines: list[str] = [
        "-- Wellness activities seed (generated by supabase/scripts/generate_seed.py)",
        "-- Re-run: python3 supabase/scripts/generate_seed.py",
        "",
        "BEGIN;",
        "",
        "-- Clear mood tags so re-seeding picks up remapped slugs",
        "DELETE FROM public.activity_mood_tags;",
        "DELETE FROM public.moods WHERE slug NOT IN ("
        + ", ".join(sql_str(s) for s in sorted(MOOD_SLUGS))
        + ");",
        "",
        "INSERT INTO public.activity_categories (slug, name, description, sort_order) VALUES",
    ]

    cat_rows = [
        f"  ({sql_str(slug)}, {sql_str(name)}, {sql_str(desc)}, {order})"
        for slug, name, desc, order in CATEGORIES
    ]
    lines.append(",\n".join(cat_rows) + "\nON CONFLICT (slug) DO NOTHING;")
    lines.append("")

    lines.append("INSERT INTO public.moods (slug, name, description, sort_order) VALUES")
    mood_rows = [
        f"  ({sql_str(slug)}, {sql_str(name)}, {sql_str(desc)}, {order})"
        for slug, name, desc, order in MOODS
    ]
    lines.append(
        ",\n".join(mood_rows)
        + "\nON CONFLICT (slug) DO UPDATE SET"
        + "\n  name = EXCLUDED.name,"
        + "\n  description = EXCLUDED.description,"
        + "\n  sort_order = EXCLUDED.sort_order;"
    )
    lines.append("")

    lines.append("INSERT INTO public.activities (")
    lines.append("  slug, title, description, category_id, duration_min_minutes, duration_max_minutes,")
    lines.append("  energy_level, indoor, outdoor, sort_order")
    lines.append(") VALUES")

    activity_rows: list[str] = []
    mood_tag_rows: list[str] = []

    for idx, row in enumerate(ACTIVITIES, start=1):
        slug, title, desc, cat, dmin, dmax, energy, indoor, outdoor, moods = row
        activity_rows.append(
            f"  ({sql_str(slug)}, {sql_str(title)}, {sql_str(desc)}, "
            f"(SELECT id FROM public.activity_categories WHERE slug = {sql_str(cat)}), "
            f"{dmin}, {dmax}, {sql_str(energy)}::public.energy_level, "
            f"{'true' if indoor else 'false'}, {'true' if outdoor else 'false'}, {idx})"
        )
        for mood_slug, suitability, weight in normalize_mood_tags(moods, energy):
            mood_tag_rows.append(
                f"  ((SELECT id FROM public.activities WHERE slug = {sql_str(slug)}), "
                f"(SELECT id FROM public.moods WHERE slug = {sql_str(mood_slug)}), "
                f"{sql_str(suitability)}::public.mood_suitability, {weight})"
            )

    lines.append(",\n".join(activity_rows))
    lines.append("ON CONFLICT (slug) DO NOTHING;")
    lines.append("")

    lines.append("INSERT INTO public.activity_mood_tags (activity_id, mood_id, suitability, weight) VALUES")
    lines.append(",\n".join(mood_tag_rows))
    lines.append(
        "ON CONFLICT (activity_id, mood_id) DO UPDATE SET "
        "suitability = EXCLUDED.suitability, weight = EXCLUDED.weight;"
    )
    lines.append("")
    lines.append("COMMIT;")
    lines.append("")

    seed_path = ROOT / "seed.sql"
    seed_path.write_text("\n".join(lines), encoding="utf-8")

    data_path = ROOT / "data" / "activities.json"
    data_path.parent.mkdir(parents=True, exist_ok=True)
    export = {
        "categories": [{"slug": c[0], "name": c[1], "description": c[2], "sort_order": c[3]} for c in CATEGORIES],
        "moods": [{"slug": m[0], "name": m[1], "description": m[2], "sort_order": m[3]} for m in MOODS],
        "activities": [
            {
                "slug": r[0],
                "title": r[1],
                "description": r[2],
                "category": r[3],
                "duration_min_minutes": r[4],
                "duration_max_minutes": r[5],
                "energy_level": r[6],
                "indoor": r[7],
                "outdoor": r[8],
                "mood_tags": [
                    {"mood": m[0], "suitability": m[1], "weight": m[2]}
                    for m in normalize_mood_tags(r[9], r[6])
                ],
            }
            for r in ACTIVITIES
        ],
    }
    data_path.write_text(json.dumps(export, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote {seed_path} ({len(ACTIVITIES)} activities, {len(mood_tag_rows)} mood tags)")
    print(f"Wrote {data_path}")


if __name__ == "__main__":
    main()
